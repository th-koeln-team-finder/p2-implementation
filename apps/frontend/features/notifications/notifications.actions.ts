'use server'

import {getSubscription} from '@/features/notifications/notifications.query'
import {usersWhoWantToReceiveNotificationsByType} from '@/features/users/users.query'
import {db} from '@repo/database'
import type {NotificationType} from '@repo/database/constants'
import {pushSubscriptions, type PushSubscriptionSelect, type UserSelect} from '@repo/database/schema'
import {serverEnv} from '@repo/env/server'
import {eq} from 'drizzle-orm'
import type {useTranslations} from 'next-intl'
import Notification from "@repo/transactional/emails/Notification";
import {getTranslations} from 'next-intl/server'
import webpush, {type PushSubscription} from 'web-push'
import sendEmail from '@repo/transactional'
import type {LangDict} from "@repo/i18n";

webpush.setVapidDetails(
  serverEnv.FRONTEND_URL,
  serverEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  serverEnv.VAPID_PRIVATE_KEY,
)

export async function subscribeUser(userId: string, sub: PushSubscription) {
  await db
    .insert(pushSubscriptions)
    .values({ userId, subscription: JSON.stringify(sub) })
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
  title: string
  body: string
  icon?: string
  vibrate?: number[]
  image?: string
  actions?: { action: string; title: string; icon?: string }[]
  lang?: keyof typeof LangDict,
  // biome-ignore lint/suspicious/noExplicitAny: any is needed here because the data can be anything
  data?: { link?: string; linkText?: string; [key: string]: any }
}

export type NotificationSettings = {
  title: TranslationParams
  body: TranslationParams
  icon?: string
  vibrate?: number[]
  image?: string
  actions?: { action: string; title: string; icon?: string }[]
  lang?: keyof typeof LangDict,
  // biome-ignore lint/suspicious/noExplicitAny: any is needed here because the data can be anything
  data?: { link?: string; linkText?: TranslationParams; [key: string]: any }
}

export async function sendNotificationByType(
  userIds: string[],
  type: NotificationType,
  data: NotificationSettings,
) {
  const users = await usersWhoWantToReceiveNotificationsByType(userIds, type)
  for (const user of users) {
    const translatedData = await fillInNotificationTranslations(data, user)
    if (user[`${type}_push`]) {
      sendPushNotification(user.id, translatedData).then(r => r)
    }
    if (user[`${type}_email`]) {
      sendEmailNotification(user, translatedData).then(r => r)
    }
  }
}

export async function fillInNotificationTranslations(
  data: NotificationSettings,
  user: UserSelect,
): Promise<NotificationData> {
  const translate = await getTranslations({ locale: user.languagePreference })
  const title = translate(...data.title)
  const body = translate(...data.body)
  const linkText = data.data?.linkText ? translate(...data.data.linkText) : undefined
  return {
    ...data,
    title,
    body,
    lang: user.languagePreference,
    data: {
      ...data.data,
      linkText,
    }
  }
}

export async function sendEmailNotification(
  user: UserSelect,
  data: NotificationData,
) {
  await sendEmail(Notification({ user, data }), {
    to: user.email,
    from: serverEnv.MAIL_FROM_ADDRESS || 'noreply@collaborize.com',
    subject: data.title,
  })
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
  const subscriptionData = subscription.subscription as PushSubscription

  try {
    await webpush.sendNotification(
      subscriptionData,
      JSON.stringify({
        title: data.title || 'Notification',
        body: data.body || 'You have a new notification',
      }),
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
