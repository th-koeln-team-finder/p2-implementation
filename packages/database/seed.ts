import {makeTests} from '@/factory/test.factory'
import {config} from 'dotenv'
import {drizzle} from 'drizzle-orm/node-postgres'
import * as Schema from './schema'
import {makeProjects} from "@/factory/projects.factory";

config()
config({ path: '.env.local', override: true })

const db = drizzle({
  schema: Schema,
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
})

export async function seed() {
  console.log('### Seeding test data ###')

  console.log("Clearing 'test' table")
  await db.delete(Schema.test).execute()

  console.log('Creating 25 test records')
  const testData = makeTests(25)
  await db.insert(Schema.test).values(testData).execute()

  console.log('Creating 10 project records')
  const projectData = makeProjects(10)
  await db.insert(Schema.projects).values(projectData).execute()

  console.log('### Seeding complete ###')
  process.exit(0)
}

if (require.main === module) {
  seed()
}
