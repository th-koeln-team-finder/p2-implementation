'use server'

import { db } from '@repo/database'
import { subscriptions } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/dist/server/web/spec-extension/unstable-cache'

export const getSubscription = cache(
  async (userId: string) =>
    db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    }),
  ['getSubscription'],
  { tags: ['subscription'] },
)
