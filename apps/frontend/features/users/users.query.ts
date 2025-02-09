'use server'

import {db, Schema} from '@repo/database'
import {eq} from 'drizzle-orm'
import {unstable_cache as cache} from "next/dist/server/web/spec-extension/unstable-cache";
import {userRelations, users} from "@repo/database/schema";

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export const getUser = cache(
  async (id: string) => db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      image: true
    }
  }),
  ['getUser'],
  {tags: ['user']},
)

