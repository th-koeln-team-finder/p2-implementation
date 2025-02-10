import { db } from '@repo/database'
import { ProjectIssue, ProjectTimetable, projects } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getProjectItems = cache(
  () => db.select().from(projects).where(eq(projects.isPublic, true)),
  ['getProjectItems'],
)

export const getProjectItem = cache(
  (id: number) => db.query.projects.findFirst({ where: eq(projects.id, id) }),
  ['getProjectItem'],
)
export const getProjectIssueList = cache((id: number) =>
  db.query.ProjectIssue.findMany({ where: eq(ProjectIssue.projectId, id) }),
)
export const getProjectTimetable = cache((id: number) =>
  db.query.ProjectTimetable.findMany({
    where: eq(ProjectTimetable.projectId, id),
  }),
)
