'use server'

import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'
import { type ProjectResourceInsert, Weekdays } from '@repo/database/schema'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'

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

  // Insert project resources that are no files since they do not need a file upload
  await createProjectResources(
    project.id,
    payload.ressources
      .filter((r) => !r.file)
      .map((r) => ({ label: r.label, link: r.href, projectId: project.id })),
  )

  return project.id
}

export async function createProjectResources(
  projectId: string,
  resources: ProjectResourceInsert[],
) {
  const resourcesToCreate = resources.map((resource) => ({
    projectId,
    label: resource.label,
    link: resource.link,
    fileUpload: resource.fileUpload,
  }))

  if (!resourcesToCreate.length) {
    return
  }

  await db.insert(Schema.projectResource).values(resourcesToCreate)
}

export async function toggleProjectBookmark(
  id: string,
  shouldBookmark: boolean,
) {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  const matchBookmark = and(
    eq(Schema.projectBookmarks.projectId, id),
    eq(Schema.projectBookmarks.userId, session.user.id),
  )
  const existingBookmark = await db.query.projectBookmarks.findFirst({
    where: matchBookmark,
  })

  if (shouldBookmark === !!existingBookmark) {
    return
  }
  if (!shouldBookmark) {
    await db.delete(Schema.projectBookmarks).where(matchBookmark)
    return
  }
  await db.insert(Schema.projectBookmarks).values({
    projectId: id,
    userId: session.user.id,
  })
}
