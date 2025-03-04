'use server'

import { authMiddleware } from '@/auth'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'
import {type ProjectPictureInsert, type ProjectResourceInsert, ProjectSelect, Weekdays} from '@repo/database/schema'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { revalidateTag } from 'next/cache'


export async function createProject(payload: CreateProjectFormValues) {
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

  const [project] = await db
    .insert(Schema.projects)
    .values({
      createdBy: session.user.id,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      phase: payload.phase,
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

export async function createProjectUploadedData(
  projectId: string,
  data:{ resources: ProjectResourceInsert[],pictures?:never}|{
    pictures: ProjectPictureInsert[];resources?:never}
) {
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
  //checks, if data is a resource or picture and creates the respective data
if("resources" in data && data.resources){
  const resourcesToCreate = data.resources.map((resource) => ({
    projectId,
    label: resource.label,
    href: resource.href,
    fileUpload: resource.fileUpload,
  }))

  if (!resourcesToCreate.length) {
    return
  }
  await db.insert(Schema.projectResource).values(resourcesToCreate)

}
//TODO: Add Check for picture DataType for upload
if("resources" in data && data.pictures){
    const picturesToCreate = data.pictures.map((picture ) => ({
      projectId,
      label: picture.label,
      file: picture.fileUpload,
    }))
    if (!picturesToCreate.length) {
      return
    }
    await db.insert(Schema.projectPicture).values(picturesToCreate)
  }

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

export async function joinProject(projectId:string) {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  if(await db.query.participants.findFirst({where: eq(Schema.participants.projectId, projectId) && eq(Schema.participants.userId, session.user.id)}))
    {
        console.log("Participant already exists!")
    }
  else {
    console.log("inserting new Participant!")
    await db.insert(Schema.participants).values({
      projectId,
      userId: session.user.id,
    })
  }
}


export async function revalidateProjects() {
  return await revalidateTag('projects')
}
