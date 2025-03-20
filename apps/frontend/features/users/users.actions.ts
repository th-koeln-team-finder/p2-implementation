'use server'

import { getProjectMemberships } from '@/features/projectMemberships/projectMemberships.query'
import { Schema, db } from '@repo/database'
import type { UserInsert } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export async function loadMoreProjects(userId: string, count = 10, offset = 0) {
  return await getProjectMemberships(userId, count, offset)
}

export async function updateUserData(user: Partial<UserInsert>) {
  if (!user.id) {
    throw new Error('User id is required to update user data')
  }
  await db
    .update(Schema.users)
    .set(user)
    .where(eq(Schema.users.id, user.id))
    .execute()
}

export async function revalidateUser() {
  await revalidateTag('user')
  await revalidateTag('users')
}

export async function deleteUser(id: string) {
  await db.delete(Schema.users).where(eq(Schema.users.id, id)).execute()
}
