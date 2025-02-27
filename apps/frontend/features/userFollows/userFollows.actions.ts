'use server'

import {db, Schema} from '@repo/database'
import {and, eq} from 'drizzle-orm'
import {revalidateTag} from 'next/cache'
import {sendNotificationByType} from "@/features/notifications/notifications.actions";
import {getUser} from "@/features/users/users.query";

export async function revalidateFollows() {
  return revalidateTag('userFollows')
}

export async function setFollows(followerId: string, followeeId: string) {
  const existingFollow = await db.query.userFollows.findFirst({
    where: and(
      eq(Schema.userFollows.followerId, followerId),
      eq(Schema.userFollows.followeeId, followeeId),
    ),
  })
  if (existingFollow) {
    await db
      .delete(Schema.userFollows)
      .where(
        and(
          eq(Schema.userFollows.followerId, followerId),
          eq(Schema.userFollows.followeeId, followeeId),
        ),
      )
      .execute()
  } else {
    await db
      .insert(Schema.userFollows)
      .values({
        followerId,
        followeeId,
      })
      .execute()

    const followerName = (await getUser(followerId))?.name

    await sendNotificationByType([followeeId], 'newFollower', {
      title: ['notifications.newFollower.title'],
      body: ['notifications.newFollower.message', {follower: followerName}]
    })
  }
}
