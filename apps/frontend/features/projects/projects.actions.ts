'use server'

import { authMiddleware } from '@/auth'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'
import type {
  ProjectPictureInsert,
  ProjectResourceInsert,
} from '@repo/database/schema'
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

  const embedding = await generateTextEmbeddings(
    `${payload.name}\n${descriptionTextValue}`,
  )

  const [project] = await db
    .insert(Schema.projects)
    .values({
      createdBy: payload.createdBy,
      name: payload.name,
      description: payload.description,
      embedding,
      status: payload.status,
      phase: payload.phase,
    })
    .returning()

  if (payload.participants[0].Users.id) {
    await db.insert(Schema.participants).values({
      userId: payload.participants[0].Users.id,
      projectId: project.id,
    })
  }
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

  await createProjectSkills(project.id, payload.skills)

  return project.id
}

async function createProjectSkills(
  projectId: string,
  skills: CreateProjectFormValues['skills'],
) {
  let projectSkillsToInsert = skills

  const skillsToCreate = skills.filter((skill) =>
    skill.value.startsWith('new:'),
  )
  if (skillsToCreate.length) {
    const newSkills = await db
      .insert(Schema.skills)
      .values(
        skillsToCreate.map((skill) => ({
          skill: skill.value.replace('new:', ''),
        })),
      )
      .returning()
    projectSkillsToInsert = skills.map((skill) => {
      if (!skill.value.startsWith('new:')) {
        return skill
      }
      const newSkill = newSkills.find(
        (newSkill) => newSkill.skill === skill.value.replace('new:', ''),
      )
      if (newSkill) {
        skill.value = newSkill.id
      }
      return skill
    })
  }

  if (!projectSkillsToInsert.length) {
    return
  }

  await db.insert(Schema.projectSkill).values(
    projectSkillsToInsert.map((skill) => ({
      projectId,
      skillId: skill.value,
      level: skill.level,
    })),
  )
}

export async function getUserProfile() {
  const session = await authMiddleware()
  return session?.user
}

export async function createProjectUploadedData(
  projectId: string,
  data:
    | { resources: ProjectResourceInsert[]; pictures?: never }
    | {
        pictures: ProjectPictureInsert[]
        resources?: never
      },
) {
  const authCheck = await authCheckCreateProject()
  if (authCheck) {
    return authCheck
  }
  //checks, if data is a resource or picture and creates the respective data
  if ('resources' in data && data.resources) {
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
  if ('resources' in data && data.pictures) {
    const picturesToCreate = data.pictures.map((picture) => ({
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

export async function joinProject(projectId: string) {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  if (
    await db.query.participants.findFirst({
      where:
        eq(Schema.participants.projectId, projectId) &&
        eq(Schema.participants.userId, session.user.id),
    })
  ) {
  } else {
    await db.insert(Schema.participants).values({
      projectId,
      userId: session.user.id,
    })
  }
}
export async function toggleProjectStar(
  projectId: string,
  shouldStar: boolean,
) {
  const session = await authMiddleware()
  const hasPermission = await hasSessionPermission('project', 'like')
  if (!hasPermission || !session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  const matchLike = and(
    eq(Schema.projectStar.projectId, projectId),
    eq(Schema.projectStar.userId, session.user.id),
  )
  const existingLike = await db.query.projectStar.findFirst({
    where: matchLike,
  })

  if (shouldStar === !!existingLike) {
    return
  }
  if (!shouldStar) {
    await db.delete(Schema.projectStar).where(matchLike)
    return
  }
  await db.insert(Schema.projectStar).values({
    projectId,
    userId: session.user.id,
  })
  await revalidateProjects()
}

export async function revalidateProjects() {
  return await revalidateTag('projects')
}
