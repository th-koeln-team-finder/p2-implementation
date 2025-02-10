import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getBrainstorms = cache(
  async (userId?: string, search = '') => {
    const searchEmbeddings = await generateTextEmbeddings(search)
    const similarity = sql<number>`1 - (${cosineDistance(Schema.brainstorms.embedding, searchEmbeddings)})`
    return db.query.brainstorms.findMany({
      extras: {
        similarity: similarity.as('similarity'),
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
      where: gt(similarity, 0.5),
      orderBy: [desc(similarity), desc(Schema.brainstorms.createdAt)],
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
