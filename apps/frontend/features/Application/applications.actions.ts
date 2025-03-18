'use server'

import { sendNotificationByType } from '@/features/notifications/notifications.actions'
import { addProjectMembership } from '@/features/projectMemberships/projectMemberships.actions'
import { Schema, db } from '@repo/database'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import {isUserAppliedToProject, isUserMemberOfProject, joinProject} from "@/features/projects/projects.actions";

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
      project: {
        with: {
          participants: true,
        },
      },
      user: true,
    },
  })
  if (!application) {
    throw new Error('Application not found')
  }
  if (await isUserMemberOfProject(application.userId, application.projectId)) {
    throw new Error('User is already member of project')
  }
  await joinProject(application.projectId, application.userId)
  await addProjectMembership({
    projectId: application.projectId,
    userId: application.userId,
    projectJoinedDate: new Date().toDateString(),
  })
  // Remove the application
  await db
    .delete(Schema.projectApplication)
    .where(eq(Schema.projectApplication.id, applicationId))
  await revalidateApplications()

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

  // send "memberJoinedProject" notification
  const projectMemberIds = application.project.participants
    .map((participants) => participants.userId)
    .filter(
      (id) => id !== application.userId && id !== application.project.createdBy,
    )
  await sendNotificationByType(projectMemberIds, 'memberJoinedProject', {
    title: [
      'notifications.memberJoinedProject.title',
      { project: application.project.name },
    ],
    body: [
      'notifications.memberJoinedProject.message',
      { user: application.user.name },
    ],
  })
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
  await db
    .delete(Schema.projectApplication)
    .where(eq(Schema.projectApplication.id, applicationId))
  await revalidateApplications()

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
