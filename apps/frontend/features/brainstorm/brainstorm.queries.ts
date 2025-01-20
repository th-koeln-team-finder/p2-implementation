import { BrainstormCacheTags } from '@/features/brainstorm/brainstorm.constants'
import { Schema, db } from '@repo/database'
import { eq, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getBrainstorms = cache(
  (userId?: string) => {
    return db.query.brainstorms.findMany({
      extras: {
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "brainstorm_bookmark" bookmark WHERE bookmark."brainstormId" = "brainstorms"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
      },
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
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
      },
    })
  },
  ['getSingleBrainstorm'],
  { tags: [BrainstormCacheTags.base] },
)
