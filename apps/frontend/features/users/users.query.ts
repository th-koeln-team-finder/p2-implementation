'use server'

import { Schema, db } from '@repo/database'
import { users } from '@repo/database/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/dist/server/web/spec-extension/unstable-cache'

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export const getUser = cache(
  async (id: string) => db.query.users.findFirst({ where: eq(users.id, id) }),
  ['getUser'],
)

export async function getUserProjects(
  _userId: number,
  limit: number,
  offset: number,
) {
  const previouslyWorkedOn: any[] = []
  for (let i = offset; i < offset + limit; i++) {
    previouslyWorkedOn.push({
      name: `Project ${i + 1}`,
      description: 'This is a project',
      image: 'https://via.placeholder.com/150',
      tags: ['tag 1', 'category', 'project', 'title', 'tag'],
    })
  }
  return previouslyWorkedOn
}

export const getUserSkills = cache(
  async (userId: string) => {
    return await db.query.userSkills.findMany({
      where: eq(Schema.userSkills.userId, userId),
      with: {
        skill: true,
      },
    })
  },
  ['getUserSkills'],
  { tags: ['user-skills'] },
)
