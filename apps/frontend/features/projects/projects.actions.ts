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
      phase: payload.phase,
      timetableMon: payload.ttMon,
      timetableTue: payload.ttTue,
      timetableWed: payload.ttWed,
      timetableThu: payload.ttThu,
      timetableFri: payload.ttFri,
      timetableSat: payload.ttSat,
      timetableSun: payload.ttSun,
      timetableCustom: payload.timetableCustom,
      location: payload.address,
    })
    .returning()
  const issuesToCreate = payload.issues.map((issue) => ({
    projectId: project.id,
    description: issue.description,
    title: issue.title,
  }))
  if (issuesToCreate.length) {
    await db.insert(Schema.projectIssue).values(issuesToCreate)
  }

  const skillsToCreate = payload.skills.map((skill) => ({
    projectId: project.id,
    skillId: skill.skillId,
    name: skill.name,
    level: skill.level,
  }))
  if (skillsToCreate.length) {
    await db.insert(Schema.projectSkill).values(skillsToCreate)
  }

  const resourcesToCreate = payload.ressources.map((resource) => ({
    projectId: project.id,
    label: resource.label,
    link: resource.href,
    fileUpload: resource.file,
  }))
  if (resourcesToCreate.length) {
    await db.insert(Schema.projectResource).values(resourcesToCreate)
  }
}
