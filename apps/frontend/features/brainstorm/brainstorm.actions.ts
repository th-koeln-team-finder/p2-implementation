'use server'

import { authMiddleware } from '@/auth'
import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
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

export async function revalidateBrainstorms() {
  await revalidateTag(BrainstormCacheTags.base)
}
