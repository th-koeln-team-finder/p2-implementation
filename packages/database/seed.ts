import { makeProjects } from '@/factory/projects.factory'
import { makeTests } from '@/factory/test.factory'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as Schema from './schema'
import {makeIssues} from "@/factory/issues.factory";
import {makeTimetableElements} from "@/factory/timetable.factory";
import {makeProjectSkills,makeUserSkill} from "@/factory/skill.factory";
import {projectSkill} from "./schema";

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
  const projectQueryIDs=  await db.insert(Schema.projects).values(projectData).returning()

  console.log('Creating 6 Issue records for each project')
  projectQueryIDs.map(async (project)=> {
  const issueData = makeIssues(6,project.id)
  await db.insert(Schema.projectIssue).values(issueData).execute()
})
  console.log('Creating 3 TimeTable Elements for each project')
  projectQueryIDs.map(async (project)=> {
    const timetableData = makeTimetableElements(3,project.id)
    await db.insert(Schema.projectTimetable).values(timetableData).execute()
  })
  console.log('Creating 5 ProjectSkills for each project')
  projectQueryIDs.map(async (project)=> {
    const projectSkills = makeProjectSkills(project.id,5)
    await db.insert(Schema.projectSkill).values(projectSkills).execute()
  })
    console.log('Creating 5 UserSkills for each User')
  projectQueryIDs.map(async(user)=>{
    const userSkills=makeUserSkill(user.id,5)
    await db.insert(Schema.userSkill).values(userSkills).execute()
  })



  console.log('### Seeding complete ###')
  process.exit(0)
}

if (require.main === module) {
  seed()
}
