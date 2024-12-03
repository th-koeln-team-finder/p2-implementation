'use server'

import { Schema, db } from '@repo/database'
import { eq } from 'drizzle-orm'

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}
