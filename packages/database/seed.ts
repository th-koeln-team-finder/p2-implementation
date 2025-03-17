import { faker } from '@faker-js/faker/locale/de'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { brainstormData, uniqueBrainstormTags } from './factory/brainstorm.data'
import { makeBrainstorm } from './factory/brainstorm.factory'
import { makeBrainstormComment } from './factory/brainstormComment.factory'
import { makeBrainstormCommentLike } from './factory/brainstormCommentLike.factory'
import { makeBrainstormResource } from './factory/brainstormResource.factory'
import { makeSkill } from './factory/skill.factory'
import { makeTag } from './factory/tag.factory'
import { makeTest } from './factory/test.factory'
import { makeUser } from './factory/user.factory'
import { makeUserFollows } from './factory/userFollows.factory'
import { makeUserProjects } from './factory/userProjects.factory'
import { makeUserSkillVerification } from './factory/userSkillVerification.factory'
import { makeUserSkills } from './factory/userSkills.factory'
import * as Schema from './schema'
import {
  projectsData,
  uniqueProjectSkills,
  uniqueProjectTags,
} from './factory/projects.data'
import { makeProject } from './factory/projects.factory'

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
export async function makeMultipleAsync<T>(
  count: number,
  maker: () => Promise<T>,
): Promise<T[]> {
  const data = [] as T[]
  for (let i = 0; i < count; i++) {
    const entry = await maker()
    if (!entry) {
      continue
    }
    data.push(entry)
  }
  return data
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
  console.log("Clearing 'skills' table")
  await db.delete(Schema.skills).execute()
  console.log(
    "Clearing 'projectSkill', 'projectIssue' and 'projectTimetable' table",
  )
  await db.delete(Schema.projectSkill).execute()
  await db.delete(Schema.projectIssue).execute()
  await db.delete(Schema.projectTimetable).execute()
  console.log(
    "Clearing 'userProjects', 'userSkills', 'userFollows' and 'userSkillVerification' table",
  )
  await db.delete(Schema.userProjects).execute()
  await db.delete(Schema.userSkills).execute()
  await db.delete(Schema.userFollows).execute()
  await db.delete(Schema.userSkillVerification).execute()

  console.log("Clearing 'user' table")
  await db.delete(Schema.users).execute()

  console.log('Creating 75 user records')
  const userData = makeMultiple(75, makeUser)
  const users = await db.insert(Schema.users).values(userData).returning()
  const userIds = users.map((e) => e.id)

  console.log("Clearing 'projects' table")
  await db.delete(Schema.projects).execute()

  console.log(`Creating ${projectsData.length} projects`)
  const projectsToInsert = []
  for (const project of projectsData) {
    projectsToInsert.push(
      await makeProject(
        project.name,
        JSON.stringify(project.description),
        project.descriptionText,
        project.status,
        userIds,
      ),
    )
  }
  const projects = await db
    .insert(Schema.projects)
    .values(projectsToInsert)
    .returning()
  const projectIds = Object.fromEntries(projects.map((e) => [e.name, e.id]))

  const projectDataWithIds = projectsData.map((project) => ({
    ...project,
    id: projectIds[project.name],
  }))

  console.log("Clearing 'skill' table")
  await db.delete(Schema.skills).execute()

  console.log(`Creating ${uniqueProjectSkills.length} skill records`)
  const insertedSkills = await db
    .insert(Schema.skills)
    .values(uniqueProjectSkills.map((skill) => ({ skill: skill.skill })))
    .returning()

  for (const project of projectDataWithIds) {
    const projectSkills = project.skills
      .map((skill) => {
        const insertedSkill = insertedSkills.find(
          (it) => it.skill === skill.skill,
        )
        if (!insertedSkill) return null
        return {
          projectId: project.id,
          skillId: insertedSkill.id,
          level: skill.level,
        }
      })
      .filter((e) => !!e)
    await db.insert(Schema.projectSkill).values(projectSkills).execute()
  }

  /*const usersToApply = userIds.slice(0, 5)
  console.log('Creating 5 project application')
  await db.insert(Schema.projectApplication).values(
    usersToApply.map((userId) => ({
      ...demoApplication,
      userId,
      projectId: project[0].id,
    })),
  )*/

  console.log("Clearing 'tag' table")
  await db.delete(Schema.tags).execute()
  const combinedTags = Array.from(
    new Set([...uniqueBrainstormTags, ...uniqueProjectTags]),
  )

  console.log(`Creating ${combinedTags.length} tag records`)
  const uniqueTags = new Set<string>()
  const tagData = []
  for (const technicalTag of combinedTags) {
    const tag = await makeTag([technicalTag], uniqueTags)
    if (tag) {
      tagData.push(tag)
    }
  }
  const tags = await db.insert(Schema.tags).values(tagData).returning()
  const tagIds = Object.fromEntries(tags.map((e) => [e.name, e.id]))

  console.log("Clearing 'brainstorm' table")
  await db.delete(Schema.brainstorms).execute()
  console.log("Clearing 'brainstorm_tag' table")
  await db.delete(Schema.brainstormTags).execute()
  console.log("Clearing 'brainstorm_comment' table")
  await db.delete(Schema.brainstormComments).execute()

  console.log(`Creating ${brainstormData.length} brainstorm records`)
  const brainstormsToInsert = []
  for (const brainstorm of brainstormData) {
    brainstormsToInsert.push(
      await makeBrainstorm(
        brainstorm.title,
        JSON.stringify(brainstorm.description),
        brainstorm.descriptionText,
        userIds,
      ),
    )
  }
  const brainstorms = await db
    .insert(Schema.brainstorms)
    .values(brainstormsToInsert)
    .returning()
  const brainstormIds = Object.fromEntries(
    brainstorms.map((e) => [e.title, e.id]),
  )

  console.log('Creating brainstorm tag records')
  const brainstormTagData = brainstormData.flatMap((brainstorm) => {
    const brainstormId = brainstormIds[brainstorm.title]
    return brainstorm.tags.map((tag) => ({
      brainstormId,
      tagId: tagIds[tag],
    }))
  })
  await db.insert(Schema.brainstormTags).values(brainstormTagData).execute()

  console.log('Creating brainstorm comment records')
  const brainstormCommentData = await Promise.all(
    brainstormData.flatMap(async (brainstorm) => {
      const brainstormId = brainstormIds[brainstorm.title]
      const comments = await Promise.all(
        brainstorm.comments.map((comment) =>
          makeBrainstormComment(brainstormId, comment, userIds),
        ),
      )
      const amountOfParentComments = faker.helpers.rangeToNumber({
        min: 1,
        max: comments.length,
      })
      const parentComments = comments.slice(0, amountOfParentComments)
      const childComments = comments.slice(amountOfParentComments)
      return [brainstormId, parentComments, childComments] as const
    }),
  )

  const comments = await db
    .insert(Schema.brainstormComments)
    .values(brainstormCommentData.flatMap((e) => e[1]))
    .returning()
  const commentIds = comments.map((e) => e.id)

  const childCommentData = brainstormCommentData.flatMap(
    ([brainstormId, , childComments]) => {
      const parentComments = comments.filter(
        (e) => e.brainstormId === brainstormId,
      )
      return childComments.map((c) => {
        const parentCommentId = faker.helpers.arrayElement(parentComments).id
        return {
          ...c,
          parentCommentId,
        }
      })
    },
  )
  await db.insert(Schema.brainstormComments).values(childCommentData).execute()

  console.log("Clearing 'brainstorm_comment_like' table")
  await db.delete(Schema.brainstormCommentLikes).execute()

  console.log('Creating 800 like records')
  const uniqueUserLikes = new Set<string>()
  const likesData = makeMultiple(800, () =>
    makeBrainstormCommentLike(commentIds, userIds, uniqueUserLikes),
  ).filter((e) => !!e)
  await db.insert(Schema.brainstormCommentLikes).values(likesData).execute()

  console.log("Clearing 'brainstorm_resource' table")
  await db.delete(Schema.brainstormResources).execute()

  console.log('Creating 100 brainstorm resource records')
  const resourceData = makeMultiple(100, () =>
    makeBrainstormResource(Object.values(brainstormIds)),
  )
  await db.insert(Schema.brainstormResources).values(resourceData).execute()

  console.log('Creating 100 skill records')
  const skillData = makeMultiple(100, () => makeSkill()).filter((e) => !!e)
  const skills = await db.insert(Schema.skills).values(skillData).returning()

  console.log('Creating 500 user skill records')
  const uniqueUserSkills = new Set<string>()
  const userSkillData = makeMultiple(500, () =>
    makeUserSkills(
      userIds,
      skills.map((it) => it.id),
      uniqueUserSkills,
    ),
  ).filter((e) => !!e)
  const userSkills = await db
    .insert(Schema.userSkills)
    .values(userSkillData)
    .returning()

  console.log('Creating 100 userProject records')
  const uniqueUserProjects = new Set<string>()
  const userProjectData = makeMultiple(100, () =>
    makeUserProjects(userIds, [undefined] as never, uniqueUserProjects),
  ).filter((e) => !!e)
  await db.insert(Schema.userProjects).values(userProjectData).execute()

  console.log('Creating 50 userFollow records')
  const userFollowData = makeMultiple(50, () =>
    makeUserFollows(userIds, userIds, new Set<string>()),
  ).filter((e) => !!e)
  await db.insert(Schema.userFollows).values(userFollowData).execute()

  console.log('Creating 1000 userSkillVerification records')
  const uniqueUserSkillVerifications = new Set<string>()
  const userSkillVerificationData = makeMultiple(1000, () =>
    makeUserSkillVerification(
      userSkills.map((it) => it.id),
      userIds,
      uniqueUserSkillVerifications,
    ),
  ).filter((e) => !!e)
  await db
    .insert(Schema.userSkillVerification)
    .values(userSkillVerificationData)
    .execute()

  console.log('### Seeding complete ###')
  process.exit(0)
}

if (require.main === module) {
  seed()
}
