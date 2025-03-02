'use server'

import { db } from '@repo/database'
import { pushSubscriptions } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/dist/server/web/spec-extension/unstable-cache'

export const getSubscription = cache(
  async (userId: string) =>
    db.query.pushSubscriptions.findFirst({
      where: eq(pushSubscriptions.userId, userId),
    }),
  ['getSubscription'],
  { tags: ['subscription'] },
)
