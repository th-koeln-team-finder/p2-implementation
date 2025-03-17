import { Schema, db } from '@repo/database'
import { and, desc, eq, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getApplicationsForProject = cache(
  async (id: string, _userId?: string) => {
    const attachmentCount =
      sql<number>`(SELECT COUNT(*) FROM "project_application_files" WHERE project_application_files."applicationId" = "projectApplication".id)`.as(
        'attachmentCount',
      )

    return await db.query.projectApplication.findMany({
      where: and(eq(Schema.projectApplication.projectId, id)),
      extras: {
        attachmentCount: attachmentCount,
      },
      with: {
        project: true,
        user: {
          with: {
            image: true,
          },
        },
      },
      orderBy: [
        desc(Schema.projectApplication.isPinned),
        desc(Schema.projectApplication.createdAt),
      ],
    })
  },
  ['getApplicationsForProject'],
  { tags: ['applications'] },
)

export const getApplication = cache(
  async (id: string) => {
    return await db.query.projectApplication.findFirst({
      where: eq(Schema.projectApplication.id, id),
      with: {
        project: true,
        files: {
          with: {
            file: true,
          },
        },
        user: {
          with: {
            image: true,
          },
        },
      },
    })
  },
  ['getApplication'],
  { tags: ['applications'] },
)
