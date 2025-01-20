'use server'

import {db, Schema} from '@repo/database'
import {eq} from 'drizzle-orm'
import {unstable_cache as cache} from "next/dist/server/web/spec-extension/unstable-cache";
import {users} from "@repo/database/schema";

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export const getUser = cache(
  async (id: string) => db.query.users.findFirst({where: eq(users.id, id)}),
  ['getUser'],
  {tags: ['user']},
)

export async function getUserProjects(userId: number, limit: number, offset: number) {
  const previouslyWorkedOn: Array<any> = []
  for (let i = offset; i < offset + limit; i++) {
    previouslyWorkedOn.push({
        name: 'Project ' + (i + 1),
        description: 'This is a project',
        image: 'https://via.placeholder.com/150',
        tags: ['tag 1', 'category', 'project', 'title', 'tag'],
      },
    )
  }
  return previouslyWorkedOn
}

