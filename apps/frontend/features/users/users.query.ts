'use server'

import type { UserWithImage } from '@/features/users/users.types'
import { Schema, db } from '@repo/database'
import type {
  NotificationColumn,
  NotificationType,
} from '@repo/database/constants'
import { type UserSelect, users } from '@repo/database/schema'
import { and, eq, inArray, or } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/dist/server/web/spec-extension/unstable-cache'

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export const getUser = cache(
  async (id: string): Promise<UserSelect | undefined> =>
    db.query.users.findFirst({
      where: eq(users.id, id),
    }),
  ['getUser'],
  { tags: ['user'] },
)

export const getUserWithImage = cache(
  async (id: string): Promise<UserWithImage | undefined> =>
    db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        image: true,
      },
    }),
  ['getUser'],
  { tags: ['user'] },
)

export const usersWhoWantToReceiveNotificationsByType = cache(
  async (userIds: string[], type: NotificationType) => {
    const pushColumn: NotificationColumn = `${type}_push`
    const emailColumn: NotificationColumn = `${type}_push`
    return await db.query.users.findMany({
      where: and(
        inArray(users.id, userIds),
        or(
          eq(Schema.users[pushColumn], true),
          eq(Schema.users[emailColumn], true),
        ),
      ),
    })
  },
  ['usersWhoWantToReceiveNotificationsByType'],
  { tags: ['user'] },
)
