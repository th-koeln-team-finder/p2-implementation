'use server'

import { Schema, db } from '@repo/database'
import type { ProjectMembershipsInsert } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export async function revalidateProjectMemberships() {
  return await revalidateTag('project-memberships')
}

export async function addProjectMembership(projectMembership: ProjectMembershipsInsert) {
  await db.insert(Schema.projectMemberships).values(projectMembership).execute()
}

export async function updateProjectMemberships(
  projectMembershipId: string,
  data: Partial<ProjectMembershipsInsert>,
) {
  await db
    .update(Schema.projectMemberships)
    .set(data)
    .where(eq(Schema.projectMemberships.id, projectMembershipId))
    .execute()
}

export async function removeProjectMembership(projectMembershipId: string) {
  await db
    .delete(Schema.projectMemberships)
    .where(eq(Schema.projectMemberships.id, projectMembershipId))
    .execute()
}
