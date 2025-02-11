import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { cosineDistance, desc, eq, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getBrainstorms = cache(
  async (userId?: string, search = '') => {
    const searchEmbeddings = await generateTextEmbeddings(search)

    const similarity = sql<number>`(1 - (${cosineDistance(Schema.brainstorms.embedding, searchEmbeddings)}))`
    const commentSimilarity = sql<number>`(select COALESCE(max(1 - ("top_comments"."embedding" <=> ${JSON.stringify(searchEmbeddings)})), 0) from (select "brainstorm_comment"."embedding" from "brainstorm_comment" left join lateral (select count(*) as like_count from "brainstorm_comment_like" where "brainstorm_comment_like"."commentId" = "brainstorm_comment"."id") "likes" on true where "brainstorm_comment"."brainstormId" = "brainstorms".id order by like_count desc limit 3) as "top_comments")`
    const totalSimilarity = sql<number>`(${similarity} * 2 + ${commentSimilarity}) / 3`

    return db.query.brainstorms.findMany({
      columns: {
        embedding: false,
      },
      extras: {
        totalSimilarity: totalSimilarity.as('totalSimilarity'),
        similarity: similarity.as('similarity'),
        commentSimilarity: commentSimilarity.as('commentSimilarity'),
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_bookmark" bookmark WHERE bookmark."brainstormId" = "brainstorms"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
      },
      with: {
        tags: {
          with: {
            tag: {
              columns: {
                embedding: false,
              },
            },
          },
        },
        resources: {
          with: {
            file: true,
          },
        },
      },
      // where: gt(totalSimilarity, 0.5),
      orderBy: [
        search && desc(totalSimilarity),
        desc(Schema.brainstorms.createdAt),
      ].filter(Boolean),
    })
  },
  ['getBrainstorms'],
  { tags: [BrainstormCacheTags.base] },
)

export const getSingleBrainstorm = cache(
  (id: string, userId?: string) => {
    return db.query.brainstorms.findFirst({
      extras: {
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_bookmark" bookmark WHERE bookmark."brainstormId" = "brainstorms"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
      },
      where: eq(Schema.brainstorms.id, id),
      with: {
        creator: true,
        tags: {
          with: {
            tag: true,
          },
        },
        resources: {
          with: {
            file: true,
          },
        },
      },
    })
  },
  ['getSingleBrainstorm'],
  { tags: [BrainstormCacheTags.base] },
)
