import { db } from '@repo/database'
import { projects } from '@repo/database/schema'
import { eq, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getProjectItems = cache(
  () => db.select().from(projects).where(eq(projects.isPublic, true)),
  ['getProjectItems'],
  { tags: ['projects'] },
)

export const getProjectItem = cache(
  (id: string, userId?: string) =>
    db.query.projects.findFirst({
      extras: {
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "project_bookmark" bookmark WHERE bookmark."projectId" = "projects"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
      },
      where: eq(projects.id, id),
      with: {
          issues: true,
          timetable: true,
          projectPictures: true,
          tags: true,
          participants: {
              with: {
                  users: true,
              }
          },
          bookmarks: true,
          resources: {
              with: {
                    uploadedFile: true,
              },
          },
        projectSkills: {
          with: {
            skill: true,
          },
        },
      },
    }),
  ['getProjectItem'],
  { tags: ['projects'] },
)
