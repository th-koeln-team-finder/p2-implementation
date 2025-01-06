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

export type CreateProjectWithSkillsPayload = {
  name: string
  description: string
  status: 'open' | 'closed'
  skills: Array<{
    skill: string
    level: string
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


export async function createProjectWithSkills(
    payload: CreateProjectWithSkillsPayload,
) {
  const [project] = await db
      .insert(Schema.projects)
      .values({
        name: payload.name,
        description: payload.description,
        status: payload.status,
      })
      .returning()
  const skillsToCreate = payload.skills.map((skill) => ({
    projectId: project.id,
    skill: skill.skill,
    level: skill.level,
  }))
  await db.insert(Schema.ProjectSkill).values(skillsToCreate)
}