'use server'

import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'

export async function createProject(payload: CreateProjectFormValues) {
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
  if (issuesToCreate.length) {
    await db.insert(Schema.ProjectIssue).values(issuesToCreate)
  }
}
