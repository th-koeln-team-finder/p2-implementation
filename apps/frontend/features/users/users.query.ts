'use server'

import {db, Schema} from '@repo/database'
import {eq} from 'drizzle-orm'

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

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

export async function getUserSkills(userId: string) {
  return db.query.userSkills.findMany({
    where: eq(Schema.userSkills.userId, userId),
    with: {
      skill: true,
    }
  });
}