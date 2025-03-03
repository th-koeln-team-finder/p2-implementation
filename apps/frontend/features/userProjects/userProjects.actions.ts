'use server'

import {db, Schema} from '@repo/database'
import type {UserProjectsInsert} from '@repo/database/schema'
import {eq} from 'drizzle-orm'
import {revalidateTag} from 'next/cache'

export async function revalidateUserProjects() {
  return await revalidateTag('user-projects')
}

export async function addUserProject(userProject: UserProjectsInsert) {
  await db.insert(Schema.userProjects).values(userProject).execute()
}

export async function updateUserProject(
  userProjectId: string,
  data: Partial<UserProjectsInsert>,
) {
  await db
    .update(Schema.userProjects)
    .set(data)
    .where(eq(Schema.userProjects.id, userProjectId))
    .execute()
}

export async function removeUserProject(userProjectId: string) {
  await db
    .delete(Schema.userProjects)
    .where(eq(Schema.userProjects.id, userProjectId))
    .execute()
}
