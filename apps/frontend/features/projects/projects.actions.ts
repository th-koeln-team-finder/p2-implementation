'use server'

import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'
import { Weekdays } from '@repo/database/schema'

export async function createProject(payload: CreateProjectFormValues) {
  const [project] = await db
    .insert(Schema.projects)
    .values({
      name: payload.name,
      description: payload.description,
      status: payload.status,
      phase: payload.phase,
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

  const timetableData: { weekdays: string; description: string }[] = [
    { weekdays: Weekdays.monday, description: payload.ttMon },
    { weekdays: Weekdays.tuesday, description: payload.ttTue },
    { weekdays: Weekdays.thursday, description: payload.ttThu },
    { weekdays: Weekdays.wednesday, description: payload.ttWed },
    { weekdays: Weekdays.friday, description: payload.ttFri },
    { weekdays: Weekdays.saturday, description: payload.ttSat },
    { weekdays: Weekdays.sunday, description: payload.ttSun },
  ]

  const timetableToCreate = timetableData
    .map((entry) => {
      if (entry.description !== '') {
        return {
          projectId: project.id,
          description: entry.description,
          weekdays: entry.weekdays,
        }
      }
    })
    .filter((entry) => entry !== undefined)

  if (timetableToCreate.length) {
    await db.insert(Schema.projectTimetable).values(timetableToCreate)
  }

  const skillsToCreate = payload.skills.map((skill) => ({
    name: skill.name,
    level: skill.level,
  }))
  if (skillsToCreate) {
    const skills: { name: string; id: string }[] = await db
      .insert(Schema.skill)
      .values(skillsToCreate.map((skill) => ({ name: skill.name })))
      .returning()

    const projectSkills = skills.map((skill) => ({
      projectId: project.id,
      skillId: skill.id,
      name: skill.name,
      level: skillsToCreate.find((s) => s.name === skill.name)?.level || 0,
    }))

    await db.insert(Schema.projectSkill).values(projectSkills)
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
