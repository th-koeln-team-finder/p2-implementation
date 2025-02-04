'use server'

import { authMiddleware } from '@/auth'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import { TestTags } from '@/features/test/test.constants'
import { Schema, db } from '@repo/database'
import { Roles } from '@repo/database/constants'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function findSimilarTags(input: string) {
  const embeddings = await generateTextEmbeddings(input)
  const similarity = sql<number>`1 - (${cosineDistance(Schema.tags.embedding, embeddings)})`
  console.log(
    input,
    await db
      .select({
        name: Schema.tags.name,
        similarity,
        text_similarity:
          sql<number>`similarity(${Schema.tags.name}, ${input})`.as(
            'text_similarity',
          ),
      })
      .from(Schema.tags)
      .orderBy(desc(similarity))
      .limit(15),
  )
  return await db
    .select({
      name: Schema.tags.name,
      similarity,
      text_similarity:
        sql<number>`similarity(${Schema.tags.name}, ${input})`.as(
          'text_similarity',
        ),
    })
    .from(Schema.tags)
    .where(gt(similarity, 0.5))
    .orderBy(desc(similarity))
    .limit(5)
    .execute()
}

export async function addRandomTest() {
  const hasPermission = await hasSessionPermission('test', 'create')
  const locale = await getLocale()
  if (!hasPermission) {
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }
  const _res = await db
    .insert(Schema.test)
    .values({ name: 'test', checked: false })
    .execute()
  revalidateTag(TestTags.items)
}

export async function removeAllTests() {
  const hasPermission = await hasSessionPermission('test', 'delete.all')
  const locale = await getLocale()
  if (!hasPermission) {
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }
  const _res = await db.delete(Schema.test).execute()
  revalidateTag(TestTags.items)
}

export async function toggleAdminRole() {
  const session = await authMiddleware()
  if (!session?.user) return
  let roles = session.user.roles
  if (!roles.includes(Roles.admin)) {
    roles = [Roles.admin]
  } else {
    roles = [Roles.defaultUser]
  }
  await db
    .update(Schema.users)
    .set({ roles })
    .where(eq(Schema.users.id, session.user.id))
  revalidatePath('/', 'layout')
}
