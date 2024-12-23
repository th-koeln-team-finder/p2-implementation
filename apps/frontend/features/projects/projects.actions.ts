'use server'

import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'

export type CreateProjectWithIssuesPayload = {
  name: string
  description: string
  status: 'open' | 'closed'
  issues: Array<{
    title: string
    description: string
  }>
}

export async function createProjectWithIssues(
  payload: CreateProjectWithIssuesPayload,
) {
  const [project] = await db
    .insert(Schema.projects)
    .values({
      name: payload.name,
      description: payload.description,
      status: payload.status,
    })
    .returning()
  const issuesToCreate = payload.issues.map((issue) => ({
    projectId: project.id,
    description: issue.description,
    title: issue.title,
  }))
  await db.insert(Schema.ProjectIssue).values(issuesToCreate)
}
