import { Schema, db } from '@repo/database'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getCommentsForBrainstorm = cache(
  (id: string) => {
    return db.query.brainstormComments.findMany({
      where: and(
        eq(Schema.brainstormComments.brainstormId, id),
        isNull(Schema.brainstormComments.parentCommentId),
      ),
      with: {
        brainstorm: true,
        creator: true,
        childComments: {
          with: {
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
        // Technically not the best idea to load all likes instead of just the likes... but it's fine for now
        likes: {
          columns: {
            userId: true,
          },
        },
      },
      orderBy: desc(Schema.brainstormComments.createdAt),
    })
  },
  ['getCommentsForBrainstorm'],
  { tags: ['brainstormComments'] },
)
