'use server'

import { authMiddleware } from '@/auth'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import type { CreateBrainstormFormValues } from '@/features/brainstorm/brainstorm.types'
import { Schema, db } from '@repo/database'
import type { BrainstormResourceInsert, TagSelect } from '@repo/database/schema'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { revalidateTag } from 'next/cache'
import { redirect } from '../i18n/routing'

export async function toggleBrainstormBookmark(
  id: string,
  shouldBookmark: boolean,
) {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  const matchBookmark = and(
    eq(Schema.brainstormBookmarks.brainstormId, id),
    eq(Schema.brainstormBookmarks.userId, session.user.id),
  )
  const existingBookmark = await db.query.brainstormBookmarks.findFirst({
    where: matchBookmark,
  })

  if (shouldBookmark === !!existingBookmark) {
    return
  }
  if (!shouldBookmark) {
    await db.delete(Schema.brainstormBookmarks).where(matchBookmark)
    return
  }
  await db.insert(Schema.brainstormBookmarks).values({
    brainstormId: id,
    userId: session.user.id,
  })
}

async function checkAuthCreateBrainstorm() {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return [
      true,
      redirect({
        href: '/error?error=AccessDenied',
        locale,
      }),
    ] as const
  }
  const canCreate = await hasSessionPermission('brainstorm', 'create')
  if (!canCreate) {
    const locale = await getLocale()
    return [
      true,
      redirect({
        href: '/error?error=AccessDenied',
        locale,
      }),
    ] as const
  }
  return [false, session] as const
}

export async function createBrainstorm(
  formValues: Omit<CreateBrainstormFormValues, 'resources'>,
  descriptionTextValue: string,
) {
  const authCheck = await checkAuthCreateBrainstorm()
  if (authCheck[0]) return authCheck[1]

  const descriptionEmbedding = await generateTextEmbeddings(
    `${formValues.title}\n${descriptionTextValue}`,
  )
  const [brainstorm] = await db
    .insert(Schema.brainstorms)
    .values({
      title: formValues.title,
      description: formValues.description,
      embedding: descriptionEmbedding,
      createdById: authCheck[1].user.id,
    })
    .returning()

  const newTags = await Promise.all(
    formValues.tags
      .filter((tag) => tag.value.startsWith('new:'))
      .map(async (tag) => {
        const name = tag.value.replace('new:', '')
        const embedding = await generateTextEmbeddings(name, 'small')
        return {
          name,
          embedding,
        }
      }),
  )
  let createdTags = [] as TagSelect[]
  if (newTags.length > 0) {
    createdTags = await db.insert(Schema.tags).values(newTags).returning()
  }

  const brainstormTags = formValues.tags
    .map((tag) => {
      const tagId = tag.value.startsWith('new:')
        ? createdTags.find((t) => t.name === tag.value.replace('new:', ''))?.id
        : tag.value
      if (!tagId) {
        console.error('Error creating tag', tag)
        return null
      }
      return {
        brainstormId: brainstorm.id,
        tagId,
      }
    })
    .filter((e) => !!e)
  await db.insert(Schema.brainstormTags).values(brainstormTags).returning()

  return brainstorm.id
}

export async function createBrainstormResources(
  resources: BrainstormResourceInsert[],
) {
  const authCheck = await checkAuthCreateBrainstorm()
  if (authCheck) return authCheck

  if (!resources.length) {
    return
  }
  await db.insert(Schema.brainstormResources).values(resources)
}

export async function deleteBrainstorm(id: string) {
  await db.delete(Schema.brainstorms).where(eq(Schema.brainstorms.id, id))
}

export async function revalidateBrainstorms() {
  await revalidateTag(BrainstormCacheTags.base)
}
