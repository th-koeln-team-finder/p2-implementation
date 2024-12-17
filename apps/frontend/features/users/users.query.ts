'use server'

import {Schema, db} from '@repo/database'
import {eq} from 'drizzle-orm'

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export async function getUserProjects(userId: number, limit: number, offset: number) {
  const previouslyWorkedOn: Array<any> = []
  for (let i = offset; i < limit; i++) {
    previouslyWorkedOn.push({
        name: 'Project ' + (i + 1),
        description: 'This is a project',
        image: 'https://via.placeholder.com/150',
        tags: ['tag 1', 'category', 'project', 'title', 'tag'],
      },
    )
  }
  return previouslyWorkedOn
  /*return await db.query.projects.findMany({
    where: eq(Schema.projects.userId, userId),
    limit,
    offset
  })*/
}