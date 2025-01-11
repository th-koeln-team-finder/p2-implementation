import { makeIssue } from '@/factory/issues.factory'
import { makeProject } from '@/factory/projects.factory'
import { makeProjectSkill, makeSkill } from '@/factory/skill.factory'
import { makeTests } from '@/factory/test.factory'
import { makeTimetableElement } from '@/factory/timetable.factory'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
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
  const testData = makeTests(25)
  await db.insert(Schema.test).values(testData).execute()

  console.log("Clearing 'projects' table")
  await db.delete(Schema.projects).execute()

  console.log('Creating 10 project records')
  const projectData = makeMultiple(10, makeProject)
  const projects = await db
    .insert(Schema.projects)
    .values(projectData)
    .returning()
  const projectIds = projects.map((project) => project.id)

  console.log("Clearing 'skills' table")
  await db.delete(Schema.skill).execute()

  console.log('Creating 25 skill records')
  const skillData = makeMultiple(25, makeSkill)
  const skills = await db.insert(Schema.skill).values(skillData).returning()
  const skillIds = skills.map((skill) => skill.id)

  console.log(
    "Clearing 'projectSkill', 'projectIssue' and 'projectTimetable' table",
  )
  await db.delete(Schema.projectSkill).execute()
  await db.delete(Schema.projectIssue).execute()
  await db.delete(Schema.projectTimetable).execute()

  const uniqueProjectWeekdays = new Set<string>()
  const uniqueProjectSkillIds = new Set<string>()
  for (const projectId of projectIds) {
    console.log('Seeding data for project', projectId)

    console.log('Creating 6 Issue records')
    const issueData = makeMultiple(6, () => makeIssue(projectId))
    await db.insert(Schema.projectIssue).values(issueData).execute()

    console.log('Creating 3 TimeTable Elements for each project')
    const timetableData = makeMultiple(3, () =>
      makeTimetableElement(projectId, uniqueProjectWeekdays),
    ).filter((e) => !!e)
    await db.insert(Schema.projectTimetable).values(timetableData).execute()

    console.log('Creating 5 ProjectSkills for each project')
    const projectSkills = makeMultiple(5, () =>
      makeProjectSkill(projectId, skillIds, uniqueProjectSkillIds),
    ).filter((e) => !!e)
    await db.insert(Schema.projectSkill).values(projectSkills).execute()
  }
  console.log('### Seeding complete ###')
  process.exit(0)
}

if (require.main === module) {
  seed()
}
