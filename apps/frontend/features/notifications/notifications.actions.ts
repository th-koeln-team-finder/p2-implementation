'use server'

import {getSubscription} from '@/features/notifications/notifications.query'
import {usersWhoWantToReceiveNotificationsByType} from '@/features/users/users.query'
import {db} from '@repo/database'
import type {NotificationType} from '@repo/database/constants'
import {pushSubscriptions, type PushSubscriptionSelect,} from '@repo/database/schema'
import {eq} from 'drizzle-orm'
import type {useTranslations} from 'next-intl'
import {getTranslations} from 'next-intl/server'
import webpush from 'web-push'
import {serverEnv} from "@repo/env/server";

webpush.setVapidDetails(
  serverEnv.FRONTEND_URL,
  serverEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  serverEnv.VAPID_PRIVATE_KEY,
)

export async function subscribeUser(userId: string, sub: PushSubscription) {
  await db
    .insert(pushSubscriptions)
    .values({userId, subscription: JSON.stringify(sub)})
    .execute()
}

export async function unsubscribeUser(userId: string) {
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId))
    .execute()
}

type TranslationParams = Parameters<ReturnType<typeof useTranslations<never>>>

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

export type NotificationSettings = {
  title: TranslationParams
  body: TranslationParams
  icon?: string,
  vibrate?: number[]
  image?: string
  actions?: { action: string, title: string, icon?: string }[],
  lang?: string,
  // biome-ignore lint/suspicious/noExplicitAny: any is needed here because the data can be anything
  data?: any,
}

export async function sendNotificationByType(userIds: string[], type: NotificationType, data: NotificationSettings) {
  const users = await usersWhoWantToReceiveNotificationsByType(userIds, type)
  const promises = []
  for (const user of users) {
    const translate = await getTranslations({locale: user.languagePreference})
    if (user[`${type}_push`]) {
      promises.push(sendPushNotification(user.id, {
        ...data,
        title: translate(...data.title),
        body: translate(...data.body),
        lang: user.languagePreference,
      }))
    }
  }
  await Promise.allSettled(promises)
}


export async function sendPushNotification(
  userId: string,
  data: NotificationData,
) {
  const subscription: PushSubscriptionSelect | undefined =
    await getSubscription(userId)

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
    return {success: true}
  } catch (error) {
    console.error('Error sending push notification:', error)
    return {success: false, error: 'Failed to send notification'}
  }
}