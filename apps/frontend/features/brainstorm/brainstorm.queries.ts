import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { and, cosineDistance, desc, eq, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getBrainstorms = cache(
  async (userId?: string, search = '', tags = '', limit = 25, offset = 0) => {
    const tagIds = tags
      .split(',')
      .map((tag: string) => tag.split(':')[0])
      .filter(Boolean) as string[]
    const searchEmbeddings = await generateTextEmbeddings(search)
    const tagSearchEmbeddings = await generateTextEmbeddings(search, 'small')

    const similarity = sql<number>`(1 - (${cosineDistance(Schema.brainstorms.embedding, searchEmbeddings)}))`
    const commentSimilarity = sql<number>`(select COALESCE(max(1 - ("top_comments"."embedding" <=> ${JSON.stringify(searchEmbeddings)})), NULL) from (select "brainstorm_comment"."embedding" from "brainstorm_comment" left join lateral (select count(*) as like_count from "brainstorm_comment_like" where "brainstorm_comment_like"."commentId" = "brainstorm_comment"."id") "likes" on true where "brainstorm_comment"."brainstormId" = "brainstorms".id order by like_count desc limit 3) as "top_comments")`
    const tagSimilarity = sql<number>`(select COALESCE(max(1 - ("tags"."embedding" <=> ${JSON.stringify(tagSearchEmbeddings)})), NULL) from (select "tag"."embedding" from "brainstorm_tag" left join "tag" on "brainstorm_tag"."tagId" = "tag".id where "brainstorm_tag"."brainstormId" = "brainstorms".id) as "tags")`

    const totalSimilarity = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${commentSimilarity} + 9.75))) + (1 / (0.79 + EXP(-11.4*${tagSimilarity} + 9.75)))) / 4`
    const totalSimilarityNoComment = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${tagSimilarity} + 9.75)))) / 3`
    const totalSimilarityNoTag = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${commentSimilarity} + 9.75)))) / 3`
    const totalSimilarityNoCommentTag = sql<number>`${similarity}`

    const correctTotalSimilarity = sql<number>`CASE WHEN ${commentSimilarity} IS NULL AND ${tagSimilarity} IS NULL THEN ${totalSimilarityNoCommentTag} WHEN ${commentSimilarity} IS NULL THEN ${totalSimilarityNoComment} WHEN ${tagSimilarity} IS NULL THEN ${totalSimilarityNoTag} ELSE ${totalSimilarity} END`

    const tagFilter = and(
      ...tagIds.map(
        (tagId) =>
          sql<boolean>`(EXISTS (SELECT 1 FROM "brainstorm_tag" WHERE "brainstorm_tag"."brainstormId" = "brainstorms"."id" AND "brainstorm_tag"."tagId" = ${tagId}))`,
      ),
    )

    return db.query.brainstorms.findMany({
      columns: {
        embedding: false,
      },
      extras: {
        totalSimilarity: correctTotalSimilarity.as('totalSimilarity'),
        similarity: similarity.as('similarity'),
        tagSimilarity: tagSimilarity.as('tagSimilarity'),
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
      limit,
      offset,
      where: tagFilter,
      orderBy: [
        search && desc(correctTotalSimilarity),
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
