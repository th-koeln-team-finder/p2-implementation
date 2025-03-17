'use server'

import {revalidateTag} from "next/cache";
import {db, Schema} from "@repo/database";
import {eq, sql} from "drizzle-orm";
import {getApplication} from "@/features/Application/applications.queries";
import {projectMemberships} from "@repo/database/schema";
import {addProjectMembership} from "@/features/projectMemberships/projectMemberships.actions";
import {sendNotificationByType} from "@/features/notifications/notifications.actions";

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
          projectMemberships: true,
        }
      },
      user: true,
    }
  })
  if (!application) {
    throw new Error('Application not found')
  }
  await addProjectMembership({
    projectId: application.projectId,
    userId: application.userId,
    projectJoinedDate: new Date().toDateString(),
  })
  // Remove the application
  await db.delete(Schema.projectApplication).where(eq(Schema.projectApplication.id, applicationId))
  await revalidateApplications()

  // send "membershipAccepted" notification
  await sendNotificationByType([application.userId], 'applicationStatusChanged', {
    title: ['notifications.membershipAccepted.title', { project: application.project.name }],
    body: ['notifications.membershipAccepted.message', { project: application.project.name }],
  })

  // send "memberJoinedProject" notification
  const projectMemberIds = application.project.projectMemberships
    .map(pm => pm.userId)
    .filter(id => id !== application.userId && id !== application.project.createdBy)
  await sendNotificationByType(projectMemberIds, 'memberJoinedProject', {
    title: ['notifications.memberJoinedProject.title', { project: application.project.name }],
    body: ['notifications.memberJoinedProject.message', { user: application.user.name }],
  })
}

export async function rejectApplication(applicationId: string) {
  const application = await db.query.projectApplication.findFirst({
    where: eq(Schema.projectApplication.id, applicationId),
    with: {
      project: true,
    }
  })
  if (!application) {
    throw new Error('Application not found')
  }

  // Remove the application
  await db.delete(Schema.projectApplication).where(eq(Schema.projectApplication.id, applicationId))
  await revalidateApplications()

  // send "membershipRejected" notification
  await sendNotificationByType([application.userId], 'applicationStatusChanged', {
    title: ['notifications.membershipRejected.title', { project: application.project.name }],
    body: ['notifications.membershipRejected.message', { project: application.project.name }],
  })
}