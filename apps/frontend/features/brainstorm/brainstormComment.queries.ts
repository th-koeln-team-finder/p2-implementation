import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getCommentsForBrainstorm = cache(
  async (
    id: string,
    userId?: string,
    sortBy = 'pinned' as 'pinned' | 'liked' | 'newest',
  ) => {
    return db.query.brainstormComments
      .findMany({
        where: and(
          eq(Schema.brainstormComments.brainstormId, id),
          isNull(Schema.brainstormComments.parentCommentId),
        ),
        extras: {
          likeCount:
            sql<string>`(SELECT COUNT(*) FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments"."id")`.as(
              'likeCount',
            ),
          isLiked: !userId
            ? sql<boolean>`false`.as('isLiked')
            : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments"."id" AND likes."userId" = ${userId})`.as(
                'isLiked',
              ),
        },
        with: {
          brainstorm: true,
          creator: true,
          childComments: {
            extras: {
              likeCount:
                sql<string>`(SELECT COUNT(*) FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments_childComments"."id")`.as(
                  'likeCount',
                ),
              isLiked: !userId
                ? sql<boolean>`false`.as('isLiked')
                : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments_childComments"."id" AND likes."userId" = ${userId})`.as(
                    'isLiked',
                  ),
            },
            with: {
              brainstorm: true,
              creator: true,
              // Technically not the best idea to load all likes instead of just the likes... but it's fine for now
              likes: {
                columns: {
                  userId: true,
                },
              },
            },
            orderBy: desc(Schema.brainstormComments.createdAt),
          },
        },
        orderBy: [
          sortBy === 'liked' && desc(sql`"likeCount"`),
          sortBy === 'pinned' && desc(Schema.brainstormComments.isPinned),
          desc(Schema.brainstormComments.createdAt),
        ].filter((e) => !!e),
      })
      .then((comments) =>
        comments.map((comment) => ({
          ...comment,
          likeCount: Number.parseInt(comment.likeCount),
          childComments: comment.childComments.map((childComment) => ({
            ...childComment,
            likeCount: Number.parseInt(childComment.likeCount),
          })),
        })),
      )
  },
  ['getCommentsForBrainstorm'],
  { tags: [BrainstormCacheTags.comment] },
)
