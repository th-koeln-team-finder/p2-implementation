'use server'

import {db, Schema} from '@repo/database'
import {users} from '@repo/database/schema'
import {and, eq, inArray, or} from 'drizzle-orm'
import {unstable_cache as cache} from 'next/dist/server/web/spec-extension/unstable-cache'
import type {NotificationColumn, NotificationType} from "@repo/database/constants";

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export const getUser = cache(
  async (id: string) =>
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
        )
      )
    });
  },
  ['usersWhoWantToReceiveNotificationsByType'],
  { tags: ['user'] },
)