'use server'

import { authMiddleware } from '@/auth'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import { Schema, db } from '@repo/database'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { revalidateTag } from 'next/cache'

type AddBrainstormPayload = {
  comment: string
  brainstormId: string
  parentCommentId?: string
}

export async function addBrainstormComment(values: AddBrainstormPayload) {
  const session = await authMiddleware()
  const hasPermission = await hasSessionPermission(
    'commentBrainstorm',
    'create',
  )
  if (!hasPermission || !session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  await db
    .insert(Schema.brainstormComments)
    .values({
      parentCommentId: values.parentCommentId,
      brainstormId: values.brainstormId,
      comment: values.comment,
      createdById: session.user.id,
    })
    .catch((err) => {
      console.error('Error trying to insert brainstorm comments', err)
    })
}

export async function removeBrainstormComment(id: string) {
  const session = await authMiddleware()
  const brainstormComment = await db.query.brainstormComments.findFirst({
    where: eq(Schema.brainstormComments.id, id),
  })
  const hasPermission = await hasSessionPermission(
    'commentBrainstorm',
    'delete',
    brainstormComment,
  )
  if (!hasPermission || !session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  await db
    .delete(Schema.brainstormComments)
    .where(eq(Schema.brainstormComments.id, id))
}

export async function toggleCommentLike(
  commentId: string,
  shouldLike: boolean,
) {
  const session = await authMiddleware()
  const hasPermission = await hasSessionPermission('commentBrainstorm', 'like')
  if (!hasPermission || !session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  const matchLike = and(
    eq(Schema.brainstormCommentLikes.commentId, commentId),
    eq(Schema.brainstormCommentLikes.userId, session.user.id),
  )
  const existingLike = await db.query.brainstormCommentLikes.findFirst({
    where: matchLike,
  })

  if (shouldLike === !!existingLike) {
    return
  }
  if (!shouldLike) {
    await db.delete(Schema.brainstormCommentLikes).where(matchLike)
    return
  }
  await db.insert(Schema.brainstormCommentLikes).values({
    commentId,
    userId: session.user.id,
  })
}

export async function revalidateComments() {
  await revalidateTag('brainstormComments')
}
