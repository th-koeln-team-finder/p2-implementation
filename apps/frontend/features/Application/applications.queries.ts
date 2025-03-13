import { db, Schema } from '@repo/database'
import { and, desc, eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getApplicationsForProject = cache(
  async (id: string) => {
    return await db.query.projectApplication.findMany({
      where: and(eq(Schema.projectApplication.projectId, id)),
      with: {
        project: true,
        user: {
          with: {
            image: true,
          },
        },
      },
      orderBy: desc(Schema.projectApplication.createdAt),
    })
  },
  ['getApplicationsForProject'],
  { tags: ['applications'] },
)
