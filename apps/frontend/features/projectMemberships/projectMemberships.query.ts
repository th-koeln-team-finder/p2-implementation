import { Schema, db } from '@repo/database'
import { asc, eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getProjectMemberships = cache(
  async (userId: string, limit?: number, offset?: number) => {
    return await db.query.projectMemberships.findMany({
      where: eq(Schema.projectMemberships.userId, userId),
      with: {
        project: true,
      },
      limit,
      offset,
      orderBy: [asc(Schema.projectMemberships.projectJoinedDate)],
    })
  },
  ['getProjectMemberships'],
  { tags: ['project-memberships'] },
)
