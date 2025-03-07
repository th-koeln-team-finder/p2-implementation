'use server'

import { authMiddleware } from '@/auth'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'
import { type ProjectResourceInsert, Weekdays } from '@repo/database/schema'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { revalidateTag } from 'next/cache'

async function authCheckCreateProject() {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }
  const canCreate = await hasSessionPermission('project', 'create')
  if (!canCreate) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }
  return false
}

export async function createProject(
  payload: CreateProjectFormValues,
  descriptionTextValue: string,
) {
  const authCheck = await authCheckCreateProject()
  if (authCheck) {
    return authCheck as never
  }

  console.log(`${payload.name}\n${descriptionTextValue}`)
  const embedding = await generateTextEmbeddings(
    `${payload.name}\n${descriptionTextValue}`,
  )

  const [project] = await db
    .insert(Schema.projects)
    .values({
      name: payload.name,
      description: payload.description,
      embedding,
      status: payload.status,
      phase: payload.phase,
    })
    .returning()

  const issuesToCreate = await Promise.all(
    payload.issues.map(async (issue) => ({
      projectId: project.id,
      description: issue.description,
      embedding: await generateTextEmbeddings(
        `${issue.title}\n${issue.description}`,
      ),
      title: issue.title,
    })),
  )
  if (issuesToCreate.length) {
    await db.insert(Schema.projectIssue).values(issuesToCreate)
  }

  const timetableData: { weekdays: string; description: string }[] =
    payload.timetableOutput === 'table'
      ? [
          { weekdays: Weekdays.monday, description: payload.ttMon },
          { weekdays: Weekdays.tuesday, description: payload.ttTue },
          { weekdays: Weekdays.thursday, description: payload.ttThu },
          { weekdays: Weekdays.wednesday, description: payload.ttWed },
          { weekdays: Weekdays.friday, description: payload.ttFri },
          { weekdays: Weekdays.saturday, description: payload.ttSat },
          { weekdays: Weekdays.sunday, description: payload.ttSun },
        ]
      : []

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

  if (!timetableToCreate.length && payload.timetableOutput === 'custom') {
    timetableToCreate.push({
      projectId: project.id,
      weekdays: Weekdays.standalone,
      description: payload.timetableCustom,
    })
  }
  if (timetableToCreate.length) {
    await db.insert(Schema.projectTimetable).values(timetableToCreate)
  }

  const skillsToCreate = payload.skills.map((skill) => ({
    name: skill.name,
    level: skill.level,
  }))

  // TODO Apply correct schema and search for skills on create page
  if (skillsToCreate?.length) {
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

  return project.id
}

export async function createProjectResources(
  projectId: string,
  resources: ProjectResourceInsert[],
) {
  const authCheck = await authCheckCreateProject()
  if (authCheck) {
    return authCheck
  }

  const resourcesToCreate = resources.map((resource) => ({
    projectId,
    label: resource.label,
    href: resource.href,
    fileUpload: resource.fileUpload,
  }))
  console.log(resourcesToCreate)
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

export async function revalidateProjects() {
  return await revalidateTag('projects')
}
