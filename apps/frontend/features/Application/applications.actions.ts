'use server'

import { sendNotificationByType } from '@/features/notifications/notifications.actions'
import {
  isUserMemberOfProject,
  joinProject,
} from '@/features/projects/projects.actions'
import { Schema, db } from '@repo/database'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const pinApplication = async (applicationId: string, pin: boolean) => {
  await db
    .update(Schema.projectApplication)
    .set({ isPinned: pin })
    .where(eq(Schema.projectApplication.id, applicationId))

  await revalidateApplications()
}

export async function revalidateApplications() {
  await revalidateTag('applications')
}

export async function acceptApplication(applicationId: string) {
  const application = await db.query.projectApplication.findFirst({
    where: eq(Schema.projectApplication.id, applicationId),
    with: {
      project: true,
    },
  })
  if (!application) {
    throw new Error('Application not found')
  }
  if (await isUserMemberOfProject(application.userId, application.projectId)) {
    throw new Error('User is already member of project')
  }
  await joinProject(application.projectId, application.userId, false)
  // Remove the application
  await removeApplication(applicationId)

  // send "membershipAccepted" notification
  await sendNotificationByType(
    [application.userId],
    'applicationStatusChanged',
    {
      title: [
        'notifications.membershipAccepted.title',
        { project: application.project.name },
      ],
      body: [
        'notifications.membershipAccepted.message',
        { project: application.project.name },
      ],
    },
  )
}

export async function retractApplication(applicationId: string) {
  await removeApplication(applicationId)
}

export async function rejectApplication(applicationId: string) {
  const application = await db.query.projectApplication.findFirst({
    where: eq(Schema.projectApplication.id, applicationId),
    with: {
      project: true,
    },
  })
  if (!application) {
    throw new Error('Application not found')
  }

  // Remove the application
  await removeApplication(applicationId)

  // send "membershipRejected" notification
  await sendNotificationByType(
    [application.userId],
    'applicationStatusChanged',
    {
      title: [
        'notifications.membershipRejected.title',
        { project: application.project.name },
      ],
      body: [
        'notifications.membershipRejected.message',
        { project: application.project.name },
      ],
    },
  )
}

const removeApplication = async (applicationId: string) => {
  await db
    .delete(Schema.projectApplication)
    .where(eq(Schema.projectApplication.id, applicationId))
  await revalidateApplications()
}
