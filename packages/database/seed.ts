import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { makeBrainstorm } from './factory/brainstorm.factory'
import { makeBrainstormComment } from './factory/brainstormComment.factory'
import { makeTest } from './factory/test.factory'
import { makeUser } from './factory/user.factory'
import * as Schema from './schema'

config()
config({ path: '.env.local', override: true })

const db = drizzle({
  schema: Schema,
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
})

export function makeMultiple<T>(count: number, maker: () => T): T[] {
  return Array.from({ length: count }, maker)
}

export async function seed() {
  console.log('### Seeding test data ###')

  console.log("Clearing 'test' table")
  await db.delete(Schema.test).execute()

  console.log('Creating 25 test records')
  const testData = makeMultiple(25, makeTest)
  await db.insert(Schema.test).values(testData).execute()

  console.log("Clearing 'user' table")
  await db.delete(Schema.users).execute()

  console.log('Creating 5 user records')
  const userData = makeMultiple(5, makeUser)
  const users = await db.insert(Schema.users).values(userData).returning()
  const userIds = users.map((e) => e.id)

  console.log("Clearing 'brainstorm' table")
  await db.delete(Schema.brainstorms).execute()

  console.log('Creating 50 brainstorm records')
  const brainstormData = makeMultiple(50, () => makeBrainstorm(userIds))
  const brainstorms = await db
    .insert(Schema.brainstorms)
    .values(brainstormData)
    .returning()
  const brainstormIds = brainstorms.map((e) => e.id)

  console.log('Creating 100 brainstorm comment records')
  const commentData = makeMultiple(100, () =>
    makeBrainstormComment(brainstormIds, userIds),
  )
  const parentComments = await db
    .insert(Schema.brainstormComments)
    .values(commentData)
    .returning()
  const parentCommentIds = parentComments.map((e) => e.id)

  console.log('Creating 50 child brainstorm comment records')
  const childCommentData = makeMultiple(50, () =>
    makeBrainstormComment(brainstormIds, userIds, parentCommentIds),
  )
  await db.insert(Schema.brainstormComments).values(childCommentData).execute()

  console.log('### Seeding complete ###')
  process.exit(0)
}

if (require.main === module) {
  seed()
}
