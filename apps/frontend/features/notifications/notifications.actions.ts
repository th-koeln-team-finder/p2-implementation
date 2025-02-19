'use server'

import {getSubscription} from "@/features/notifications/notifications.query";
import {usersWhoWantToReceiveNotificationsByType} from "@/features/users/users.query";
import {db} from "@repo/database";
import type {NotificationType} from "@repo/database/constants";
import {type SubscriptionSelect, subscriptions } from "@repo/database/schema";
import {eq} from "drizzle-orm";
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function subscribeUser(userId: string, sub: PushSubscription) {
  await db
    .insert(subscriptions)
    .values({ userId, subscription: JSON.stringify(sub) })
    .execute()
}

export async function unsubscribeUser(userId: string) {
  await db
    .delete(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .execute()
}

export type NotificationData = {
  title?: string
  body?: string
  icon?: string,
  vibrate?: number[]
  image?: string
  actions?: { action: string, title: string, icon?: string }[],
  lang?: string,
  // biome-ignore lint/suspicious/noExplicitAny: any is needed here because the data can be anything
  data?: any,
}

export async function sendNotificationByType(userIds: string[], type: NotificationType, data: NotificationData) {
  const users = await usersWhoWantToReceiveNotificationsByType(userIds, type)
  const promises = []
  for (const user of users) {
    if (user[`${type}_push`]) {
      promises.push(sendPushNotification(user.id, data))
    }
  }
  await Promise.allSettled(promises)
}


export async function sendPushNotification(userId: string, data: NotificationData) {
  const subscription: SubscriptionSelect | undefined = await getSubscription(userId)

  if (!subscription) {
    throw new Error('No subscription available')
  }
  const subscriptionData = subscription.subscription

  try {
    await webpush.sendNotification(
      subscriptionData,
      JSON.stringify({
        title: data.title || 'Notification',
        body: data.body || 'You have a new notification',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}