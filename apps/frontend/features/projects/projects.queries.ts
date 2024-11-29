import { db } from '@repo/database'
import { projects } from '@repo/database/schema'
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
