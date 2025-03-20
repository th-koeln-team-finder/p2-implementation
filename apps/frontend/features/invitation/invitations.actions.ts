'use server'

import { joinProject } from '@/features/projects/projects.actions'
import { Schema, db } from '@repo/database'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export async function revalidateInvitations() {
  await revalidateTag('invitations')
}

export async function acceptInvitation(invitationId: string) {
  const invitation = await db.query.userInvitations.findFirst({
    where: eq(Schema.userInvitations.id, invitationId),
    with: {
      project: true,
      user: true,
    },
  })
  if (!invitation) {
    throw new Error('Invitation not found')
  }
  await joinProject(invitation.projectId, invitation.userId)

  await deleteInvitation(invitationId)
}

export async function rejectInvitation(invitationId: string) {
  await deleteInvitation(invitationId)
}

async function deleteInvitation(invitationId: string) {
  await db
    .delete(Schema.userInvitations)
    .where(eq(Schema.userInvitations.id, invitationId))
  await revalidateInvitations()
}
