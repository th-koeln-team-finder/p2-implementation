'use server'

import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import type {CreateApplicationFormValues, CreateProjectFormValues} from '@/features/projects/projects.types'
import { db } from '@repo/database'
import * as Schema from '@repo/database/schema'
// biome-ignore lint/style/useImportType: <explanation>
import {type ProjectApplicationInsert, ProjectInsert} from '@repo/database/schema'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'

/*export async function createProject(payload: CreateProjectFormValues) {
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

    /*const issuesToCreate = payload.issues.map((issue) => ({
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

    // Insert project resources that are no files since they do not need a file upload
    await createProjectResources(
        project.id,
        payload.resources
            .filter((r) => !r.file?.[0])
            .map((r) => ({ label: r.label, href: r.href, projectId: project.id })),
    )

    return project.id
}

/*export async function createApplication(
    payload: CreateApplicationFormValues,
  projectId: string,
  application: ProjectApplicationInsert[],
) {
  const [projectApplication] = await db
      .insert(Schema.projectApplication)
      .values({
        //projectId: project.id,
        firstName: payload.firstName,
        /*description: application.description,
        status: application.status,
        phase: application.phase,
        location: application.address,
      })
      .returning()

  await db.insert(Schema.projectApplication).values(projectApplication)
}*/

export async function createProject(payload: ProjectInsert) {

    const [project] = await db
        .insert(Schema.projects)
        .values(payload)
        .returning()

    return project.id
}

/*export async function createApplication(projectId: string, payload: ProjectApplicationInsert) {
    try {
        const [application] = await db
            .insert(Schema.projectApplication)
            .values({
                projectId: projectId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                mail: payload.mail,
                phone: payload.phone,
                message: payload.message,
            })
            .returning()

        console.log('Bewerbung erfolgreich gespeichert:', application)
        return application
    } catch (error) {
        console.error('Fehler beim Speichern der Bewerbung:', error)
        throw error
    }
}*/
export async function createApplication(payload: ProjectApplicationInsert) {
    try {
        console.log('Starte Bewerbungserstellung für Projekt-ID:', payload.projectId)
        console.log('Payload für Bewerbung:', payload)

        const [application] = await db
            .insert(Schema.projectApplication)
            .values({
                projectId: payload.projectId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                mail: payload.mail,
                phone: payload.phone,
                message: payload.message,
            })
            .returning()

        console.log('Bewerbung erfolgreich gespeichert:', application)
        return application
    } catch (error) {
        console.error('Fehler bei der Bewerbungserstellung:', error)
        throw error
    }
}