'use server'

import {unstable_cache as cache} from "next/dist/server/web/spec-extension/unstable-cache";
import {db} from "@repo/database";
import {eq} from "drizzle-orm";
import {subscriptions} from "@repo/database/schema";

export const getSubscription = cache(
  async (userId: string) =>
    db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    }),
  ['getSubscription'],
  { tags: ['subscription'] },
)