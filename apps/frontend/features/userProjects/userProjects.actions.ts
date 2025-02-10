'use server'

import { Schema, db } from '@repo/database'
import type { UserProjectsInsert } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export async function revalidateUserProjects() {
  return revalidateTag('user-projects')
}

export async function addUserProject(userProject: UserProjectsInsert) {
  await db.insert(Schema.userProjects).values(userProject).execute()
}

export async function updateUserProject(
  userProjectId: number,
  data: Partial<UserProjectsInsert>,
) {
  await db
    .update(Schema.userProjects)
    .set(data)
    .where(eq(Schema.userProjects.id, userProjectId))
    .execute()
}

export async function removeUserProject(userProjectId: number) {
  await db
    .delete(Schema.userProjects)
    .where(eq(Schema.userProjects.id, userProjectId))
    .execute()
}
