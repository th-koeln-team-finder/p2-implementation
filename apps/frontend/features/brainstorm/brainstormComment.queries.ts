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
    const likeCount =
      sql<string>`(SELECT COUNT(*) FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments"."id")`.as(
        'likeCount',
      )
    const isLiked = !userId
      ? sql<boolean>`false`.as('isLiked')
      : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments"."id" AND likes."userId" = ${userId})`.as(
          'isLiked',
        )
    const likeCountChild =
      sql<string>`(SELECT COUNT(*) FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments_childComments"."id")`.as(
        'likeCount',
      )
    const isLikedChild = !userId
      ? sql<boolean>`false`.as('isLiked')
      : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_comment_like" likes WHERE likes."commentId" = "brainstormComments_childComments"."id" AND likes."userId" = ${userId})`.as(
          'isLiked',
        )

    return db.query.brainstormComments
      .findMany({
        columns: {
          embedding: false,
        },
        where: and(
          eq(Schema.brainstormComments.brainstormId, id),
          isNull(Schema.brainstormComments.parentCommentId),
        ),
        extras: {
          likeCount,
          isLiked,
        },
        with: {
          creator: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              image: {
                columns: {
                  bucketPath: true,
                },
              },
            },
          },
          childComments: {
            columns: {
              embedding: false,
            },
            extras: {
              likeCount: likeCountChild,
              isLiked: isLikedChild,
            },
            with: {
              creator: {
                columns: {
                  id: true,
                  name: true,
                },
                with: {
                  image: {
                    columns: {
                      bucketPath: true,
                    },
                  },
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
