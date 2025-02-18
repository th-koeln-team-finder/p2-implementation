'use server'

import webpush from 'web-push'
import {db, Schema} from "@repo/database";
import {eq} from "drizzle-orm";
import {getSubscription} from "@/features/notifications/notifications.query";
import {subscriptions, SubscriptionSelect} from "@repo/database/schema";

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

export async function sendNotification(userId: string, message: string) {
  const subscription: SubscriptionSelect | undefined = await getSubscription(userId)

  if (!subscription) {
    throw new Error('No subscription available')
  }
  const subscriptionData = subscription.subscription

  try {
    await webpush.sendNotification(
      subscriptionData,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icons/192x192.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}