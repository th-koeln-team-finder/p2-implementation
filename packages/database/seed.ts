import { faker } from '@faker-js/faker/locale/de'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { makeBrainstorm } from './factory/brainstorm.factory'
import { makeBrainstormComment } from './factory/brainstormComment.factory'
import { makeBrainstormCommentLike } from './factory/brainstormCommentLike.factory'
import { makeIssue } from './factory/issues.factory'
import { makeProject } from './factory/projects.factory'
import { makeProjectSkill, makeSkill } from './factory/skill.factory'
import { makeTag } from './factory/tag.factory'
import { makeTest } from './factory/test.factory'
import { makeTimetableElement } from './factory/timetable.factory'
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
  console.log("Clearing 'user' table")
  await db.delete(Schema.users).execute()

  console.log('Creating 25 user records')
  const userData = makeMultiple(25, makeUser)
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

  console.log("Clearing 'brainstorm_comment' table")
  await db.delete(Schema.brainstormComments).execute()

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
  const childComments = await db
    .insert(Schema.brainstormComments)
    .values(childCommentData)
    .returning()
  const childCommentIds = childComments.map((e) => e.id)

  const commentIds = [...parentCommentIds, ...childCommentIds]

  console.log("Clearing 'brainstorm_comment_like' table")
  await db.delete(Schema.brainstormCommentLikes).execute()

  console.log('Creating 1500 like records')
  const uniqueUserLikes = new Set<string>()
  const likesData = makeMultiple(1500, () =>
    makeBrainstormCommentLike(commentIds, userIds, uniqueUserLikes),
  ).filter((e) => !!e)
  await db.insert(Schema.brainstormCommentLikes).values(likesData).execute()

  console.log("Clearing 'tag' table")
  await db.delete(Schema.tags).execute()

  console.log('Creating 30 tag records')
  const uniqueTags = new Set<string>()
  const tagData = makeMultiple(30, () => makeTag(uniqueTags)).filter((e) => !!e)
  const tags = await db.insert(Schema.tags).values(tagData).returning()
  const tagIds = tags.map((e) => e.id)

  console.log("Clearing 'brainstorm_tag' table")
  await db.delete(Schema.brainstormTags).execute()

  console.log('Creating 50 brainstorm tag records')
  const brainstormTagData = brainstormIds.flatMap((brainstormId) => {
    const tagAmount = faker.number.int({ min: 1, max: 8 })
    const selectedTagIds = faker.helpers.arrayElements(tagIds, tagAmount)
    return selectedTagIds.map((tagId) => ({
      brainstormId,
      tagId,
    }))
  })
  await db.insert(Schema.brainstormTags).values(brainstormTagData).execute()

  console.log('### Seeding complete ###')
  process.exit(0)
}

if (require.main === module) {
  seed()
}
