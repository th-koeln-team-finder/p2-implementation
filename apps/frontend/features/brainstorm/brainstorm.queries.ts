import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { cosineDistance, desc, eq, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getBrainstorms = cache(
  async (
    userId?: string,
    search = '',
    pinBookmarks = false,
    limit = 25,
    offset = 0,
  ) => {
    const searchEmbeddings = await generateTextEmbeddings(search)
    const tagSearchEmbeddings = await generateTextEmbeddings(search, 'small')

    const {
      similarity,
      commentSimilarity,
      tagSimilarity,
      correctTotalSimilarity,
    } = getSimilarities(searchEmbeddings, tagSearchEmbeddings)

    const { totalMatchScore } = getMatchScores(userId)

    const isBookmarked = !userId
      ? sql<boolean>`(false)`.as('isBookmarked')
      : sql<boolean>`(EXISTS (SELECT id FROM "brainstorm_bookmark" bookmark WHERE bookmark."brainstormId" = "brainstorms"."id" AND bookmark."userId" = ${userId}))`.as(
          'isBookmarked',
        )

    return db.query.brainstorms.findMany({
      columns: {
        embedding: false,
      },
      extras: {
        totalMatchScore: userId
          ? totalMatchScore.as('totalMatchScore')
          : sql<number>`NULL`.as('totalMatchScore'),
        totalSimilarity: search
          ? correctTotalSimilarity.as('totalSimilarity')
          : sql<number>`NULL`.as('totalSimilarity'),
        similarity: search
          ? similarity.as('similarity')
          : sql<number>`NULL`.as('similarity'),
        tagSimilarity: search
          ? tagSimilarity.as('tagSimilarity')
          : sql<number>`NULL`.as('tagSimilarity'),
        commentSimilarity: search
          ? commentSimilarity.as('commentSimilarity')
          : sql<number>`NULL`.as('commentSimilarity'),
        isBookmarked,
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
      orderBy: [
        pinBookmarks && desc(isBookmarked),
        search && desc(correctTotalSimilarity),
        userId && desc(totalMatchScore),
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
      columns: {
        embedding: false,
      },
      extras: {
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_bookmark" bookmark WHERE bookmark."brainstormId" = "brainstorms"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
      },
      where: eq(Schema.brainstorms.id, id),
      with: {
        creator: {
          with: {
            image: true,
          },
        },
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
    })
  },
  ['getSingleBrainstorm'],
  { tags: [BrainstormCacheTags.base] },
)

function getSimilarities(
  searchEmbeddings: number[],
  tagSearchEmbeddings: number[],
) {
  const similarity = sql<number>`(1 - (${cosineDistance(Schema.brainstorms.embedding, searchEmbeddings)}))`
  const commentSimilarity = sql<number>`(select COALESCE(max(1 - ("top_comments"."embedding" <=> ${JSON.stringify(searchEmbeddings)})), NULL) from (select "brainstorm_comment"."embedding" from "brainstorm_comment" left join lateral (select count(*) as like_count from "brainstorm_comment_like" where "brainstorm_comment_like"."commentId" = "brainstorm_comment"."id") "likes" on true where "brainstorm_comment"."brainstormId" = "brainstorms".id order by like_count desc limit 3) as "top_comments")`
  const tagSimilarity = sql<number>`(select COALESCE(max(1 - ("tags"."embedding" <=> ${JSON.stringify(tagSearchEmbeddings)})), NULL) from (select "tag"."embedding" from "brainstorm_tag" left join "tag" on "brainstorm_tag"."tagId" = "tag".id where "brainstorm_tag"."brainstormId" = "brainstorms".id) as "tags")`

  const totalSimilarity = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${commentSimilarity} + 9.75))) + (1 / (0.79 + EXP(-11.4*${tagSimilarity} + 9.75)))) / 4`
  const totalSimilarityNoComment = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${tagSimilarity} + 9.75)))) / 3`
  const totalSimilarityNoTag = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${commentSimilarity} + 9.75)))) / 3`
  const totalSimilarityNoCommentTag = sql<number>`${similarity}`

  const correctTotalSimilarity = sql<number>`CASE WHEN ${commentSimilarity} IS NULL AND ${tagSimilarity} IS NULL THEN ${totalSimilarityNoCommentTag} WHEN ${commentSimilarity} IS NULL THEN ${totalSimilarityNoComment} WHEN ${tagSimilarity} IS NULL THEN ${totalSimilarityNoTag} ELSE ${totalSimilarity} END`
  return {
    similarity,
    commentSimilarity,
    tagSimilarity,
    correctTotalSimilarity,
  }
}

function getMatchScores(userId: string | undefined) {
  const totalMatchScore = sql<number>`((SELECT COUNT(DISTINCT tag) * 1.0 FROM (SELECT tag."tagId" as tag FROM brainstorm_bookmark bookmark JOIN brainstorm_tag tag ON bookmark."brainstormId" = tag."brainstormId" WHERE bookmark."userId" = ${userId} UNION ALL SELECT tag."tagId" as tag FROM project_bookmark bookmark JOIN project_tag tag ON bookmark."projectId" = tag."projectId" WHERE bookmark."userId" = ${userId} UNION ALL SELECT tag."tagId" as tag FROM project_star star JOIN project_tag tag ON star."projectId" = tag."projectId" WHERE star."userId" = ${userId}) as tags WHERE tags.tag IN (SELECT "tagId" FROM brainstorm_tag bt WHERE bt."brainstormId" = "brainstorms"."id")) / (SELECT GREATEST(COUNT(DISTINCT bt."tagId") * 1.0, 1.0) FROM brainstorm_tag bt WHERE bt."brainstormId" = "brainstorms"."id"))`
  return {
    totalMatchScore,
  }
}
