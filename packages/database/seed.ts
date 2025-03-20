import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { faker } from '@faker-js/faker/locale/de'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'minio'
import { brainstormData, uniqueBrainstormTags } from './factory/brainstorm.data'
import { makeBrainstorm } from './factory/brainstorm.factory'
import { makeBrainstormComment } from './factory/brainstormComment.factory'
import { makeBrainstormCommentLike } from './factory/brainstormCommentLike.factory'
import { makeBrainstormResource } from './factory/brainstormResource.factory'
import { makeIssue } from './factory/issues.factory'
import { makeProjectMemberships } from './factory/projectMemberships.factory'
import {
  projectsData,
  uniqueProjectSkills,
  uniqueProjectTags,
  uniqueProjectUsers,
} from './factory/projects.data'
import { makeProject } from './factory/projects.factory'
import { makeTag } from './factory/tag.factory'
import { makeUserFollows } from './factory/userFollows.factory'
import { makeUserSkillVerification } from './factory/userSkillVerification.factory'
import { makeUserSkills } from './factory/userSkills.factory'
import { userDescriptions } from './factory/users.data'
import * as Schema from './schema'
import { type ProjectResourceInsert, type UserInsert, Weekdays } from './schema'

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

  console.log('Clearing all tables')
  await db.delete(Schema.users).execute()
  await db.delete(Schema.userSkills).execute()
  await db.delete(Schema.userSkillVerification).execute()
  await db.delete(Schema.userRatings).execute()
  await db.delete(Schema.userFollows).execute()
  await db.delete(Schema.projectMemberships).execute()
  await db.delete(Schema.userProjectSettings).execute()
  await db.delete(Schema.skills).execute()
  await db.delete(Schema.projects).execute()
  await db.delete(Schema.participants).execute()
  await db.delete(Schema.projectSkill).execute()
  await db.delete(Schema.projectPicture).execute()
  await db.delete(Schema.projectResource).execute()
  await db.delete(Schema.projectIssue).execute()
  await db.delete(Schema.projectTimetable).execute()
  await db.delete(Schema.projectStar).execute()
  await db.delete(Schema.projectBookmarks).execute()
  await db.delete(Schema.brainstorms).execute()
  await db.delete(Schema.brainstormComments).execute()
  await db.delete(Schema.brainstormCommentLikes).execute()
  await db.delete(Schema.brainstormBookmarks).execute()
  await db.delete(Schema.brainstormResources).execute()
  await db.delete(Schema.tags).execute()
  await db.delete(Schema.projectTags).execute()
  await db.delete(Schema.brainstormTags).execute()
  await db.delete(Schema.uploadedFiles).execute()
  await db.delete(Schema.pushSubscriptions).execute()
  await db.delete(Schema.accounts).execute()
  await db.delete(Schema.sessions).execute()
  await db.delete(Schema.authenticators).execute()

  console.log(`Creating ${uniqueProjectUsers.length} user records`)
  const userData = uniqueProjectUsers.map((user): UserInsert => {
    const [firstname, lastname] = user.split(' ')
    return {
      firstName: firstname,
      lastName: lastname,
      name: faker.internet.username(),
      email: faker.internet.email({ firstName: firstname, lastName: lastname }),
      roles: ['default-user'],
      bio: JSON.stringify(faker.helpers.arrayElement(userDescriptions)),
    }
  })

  const users = await db.insert(Schema.users).values(userData).returning()
  const userIds = users.map((e) => e.id)
  const userIdsMap = Object.fromEntries(
    users.map((e) => [`${e.firstName} ${e.lastName}`, e.id]),
  )

  console.log(`Creating ${projectsData.length} projects`)
  const [initialProjectData, ...restProjectsData] = projectsData
  // Loading the first one like this so the embeddings model can get loaded
  const initialProject = await makeProject(userIds, initialProjectData)
  const projectData = await Promise.all(
    restProjectsData.map((p) => makeProject(userIds, p)),
  )
  projectData.push(initialProject)
  const projects = await db
    .insert(Schema.projects)
    .values(projectData)
    .returning()
  const projectIds = Object.fromEntries(projects.map((e) => [e.name, e.id]))

  console.log('Uploading project pictures to Minio')
  const fileIds = Object.fromEntries(
    await Promise.all(
      projectsData.flatMap((project) =>
        project.file.map(
          async (file): Promise<[string, string]> => [
            file.image,
            await uploadToMinio(
              file.image,
              `projects/${projectIds[project.name]}/${file.image.replace('demo-images/', '')}`,
              faker.helpers.arrayElement(userIds),
            ),
          ],
        ),
      ),
    ),
  )

  console.log('Creating project picture records')
  const projectPictureData = projectsData.flatMap((project) =>
    project.file.map((file) => ({
      projectId: projectIds[project.name],
      fileUpload: fileIds[file.image],
      label: project.name,
    })),
  )
  await db.insert(Schema.projectPicture).values(projectPictureData).execute()

  console.log(`Creating ${brainstormData.length} brainstorms`)
  const [initialBrainstormData, ...restBrainstormsData] = brainstormData
  // Loading the first one like this so the embeddings model can get loaded
  const initialBrainstorm = await makeBrainstorm(userIds, initialBrainstormData)
  const brainstormInsertData = await Promise.all(
    restBrainstormsData.map((b) => makeBrainstorm(userIds, b)),
  )
  brainstormInsertData.push(initialBrainstorm)
  const brainstorms = await db
    .insert(Schema.brainstorms)
    .values(brainstormInsertData)
    .returning()
  const brainstormIds = Object.fromEntries(
    brainstorms.map((e) => [e.title, e.id]),
  )

  console.log(`Creating ${uniqueProjectSkills.length} skill records`)
  const insertedSkills = await db
    .insert(Schema.skills)
    .values(uniqueProjectSkills.map((skill) => ({ skill })))
    .returning()
  const skillIds = Object.fromEntries(
    insertedSkills.map((e) => [e.skill, e.id]),
  )

  console.log('Creating project skill records')
  const projectSkillData = projectsData.flatMap((project) =>
    project.skills.map((skill) => ({
      projectId: projectIds[project.name],
      skillId: skillIds[skill.skill],
      level: skill.level,
    })),
  )
  await db.insert(Schema.projectSkill).values(projectSkillData).execute()

  const formatTag = (tag: string) =>
    tag.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const [initialTag, ...combinedTags] = Array.from(
    new Set([...uniqueBrainstormTags, ...uniqueProjectTags].map(formatTag)),
  )
  console.log(`Creating ${combinedTags.length} tag records`)
  const initialTagData = await makeTag(initialTag)
  const tagData = await Promise.all(combinedTags.map(makeTag))
  tagData.push(initialTagData)
  const tags = await db.insert(Schema.tags).values(tagData).returning()
  const tagIds = Object.fromEntries(tags.map((e) => [e.name, e.id]))

  console.log('Creating project tag records')
  const projectTagData = projectsData.flatMap((project) =>
    project.tags.map(formatTag).map((tag) => ({
      projectId: projectIds[project.name],
      tagId: tagIds[tag],
    })),
  )
  await db.insert(Schema.projectTags).values(projectTagData).execute()

  console.log('Creating brainstorm tag records')
  const brainstormTagData = brainstormData.flatMap((brainstorm) =>
    brainstorm.tags.map(formatTag).map((tag) => ({
      brainstormId: brainstormIds[brainstorm.title],
      tagId: tagIds[tag],
    })),
  )
  await db.insert(Schema.brainstormTags).values(brainstormTagData).execute()

  console.log('Creating project resource records')
  const domainRegex = /https?:\/\/(?:www\.)?([^\/.]+)\./
  const projectResourceData = projectsData.flatMap((project) =>
    project.resources.map(
      (resource): ProjectResourceInsert => ({
        projectId: projectIds[project.name],
        label: resource.match(domainRegex)?.[1] ?? resource,
        href: resource,
      }),
    ),
  )
  await db.insert(Schema.projectResource).values(projectResourceData).execute()

  console.log('Creating project timetable records')
  const projectTimeTableData = projectsData.flatMap(
    (project) =>
      project.timetable?.map((timetableEntry) => {
        const [weekdayRaw, time] = timetableEntry.date.split(' ')
        const weekdays = Object.values(Weekdays).find((e) =>
          weekdayRaw.startsWith(e),
        )
        if (!weekdays) {
          throw new Error(`Invalid weekday: ${weekdayRaw}`)
        }
        return {
          projectId: projectIds[project.name],
          weekdays,
          description: `${time}: ${timetableEntry.description}`,
        }
      }) ?? [],
  )
  await db
    .insert(Schema.projectTimetable)
    .values(projectTimeTableData)
    .execute()

  console.log('Creating project member records')
  const projectMemberData = projectsData.flatMap((project) =>
    project.teamMembers.map((member) => ({
      projectId: projectIds[project.name],
      userId: userIdsMap[member.name],
      role: 'participant',
    })),
  )
  await db.insert(Schema.participants).values(projectMemberData).execute()

  console.log('Creating project issue records')
  const [initialProjectIssueData, ...projectIssuesDataRaw] =
    projectsData.flatMap(
      (project) =>
        project.issues?.map((issue) => ({
          projectId: projectIds[project.name],
          description: issue.description,
          title: issue.title,
        })) ?? [],
    )
  const initialProjectIssue = await makeIssue(initialProjectIssueData)
  const projectIssueData = await Promise.all(
    projectIssuesDataRaw.map(makeIssue),
  )
  projectIssueData.push(initialProjectIssue)
  await db.insert(Schema.projectIssue).values(projectIssueData).execute()

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

  console.log('Creating 500 user skill records')
  const uniqueUserSkills = new Set<string>()
  const userSkillData = makeMultiple(500, () =>
    makeUserSkills(userIds, Object.values(skillIds), uniqueUserSkills),
  ).filter((e) => !!e)
  const userSkills = await db
    .insert(Schema.userSkills)
    .values(userSkillData)
    .returning()

  console.log('Creating 100 userProject records')
  const uniqueUserProjects = new Set<string>()
  const projectMembershipData = makeMultiple(100, () =>
    makeProjectMemberships(userIds, [undefined] as never, uniqueUserProjects),
  ).filter((e) => !!e)
  await db
    .insert(Schema.projectMemberships)
    .values(projectMembershipData)
    .execute()

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

  function getRandomUniqueUserMap<Key extends string>(
    key: Key,
    otherIds: string[],
    min = 5,
    max = 15,
  ): Array<{ userId: string } & { [key in Key]: string }> {
    const pairs = userIds.flatMap((userId) =>
      makeMultiple(
        faker.number.int({ min, max }),
        () => `${userId}::${faker.helpers.arrayElement(otherIds)}`,
      ),
    )
    const uniquePairs = new Set<string>(pairs)
    return Array.from(uniquePairs).map((pair) => {
      const [userId, projectId] = pair.split('::')
      return { userId, [key]: projectId }
    }) as Array<{ userId: string } & { [key in Key]: string }>
  }

  console.log('Creating 5-15 brainstorm bookmarks per user')
  const uniqueBrainstormBookmarks = getRandomUniqueUserMap(
    'brainstormId',
    Object.values(brainstormIds),
  )
  await db
    .insert(Schema.brainstormBookmarks)
    .values(uniqueBrainstormBookmarks)
    .execute()

  console.log('Creating 5-15 project bookmarks per user')
  const uniqueProjectBookmarks = getRandomUniqueUserMap(
    'projectId',
    Object.values(projectIds),
  )
  await db
    .insert(Schema.projectBookmarks)
    .values(uniqueProjectBookmarks)
    .execute()

  console.log('Creating 5-15 project stars per user')
  const uniqueProjectStars = getRandomUniqueUserMap(
    'projectId',
    Object.values(projectIds),
  )
  await db.insert(Schema.projectStar).values(uniqueProjectStars).execute()

  console.log('### Seeding complete ###')
  process.exit(0)
}

const minioClient = new Client({
  endPoint: process.env.MINIO_HOST ?? 'localhost',
  port: +(process.env.MINIO_PORT ?? 9000),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})
const bucket = process.env.MINIO_BUCKET ?? 'collaborize'

export function generatePresignedUrl(bucketPath: string) {
  return minioClient.presignedPutObject(bucket, bucketPath, 60 * 5)
}
async function uploadToMinio(
  filePath: string,
  path: string,
  uploadedById: string,
): Promise<string> {
  const presignedUrl = await generatePresignedUrl(path)
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath)
    const fileStats = fs.statSync(filePath)
    const fileSize = fileStats.size // Get file size
    const contentType = getMimeType(filePath) // Get content type

    const options: http.RequestOptions = {
      method: 'PUT', // MinIO presigned URLs require PUT
      headers: {
        'Content-Length': fileSize, // Required for MinIO
        'Content-Type': contentType, // Required for file type
      },
    }

    const req = http.request(presignedUrl, options, async (res) => {
      const [file] = await db
        .insert(Schema.uploadedFiles)
        .values({
          bucketPath: path,
          fileType: contentType,
          fileSize,
          status: 'uploaded',
          uploadedById,
        })
        .returning()

      if (res.statusCode === 200) {
        resolve(file.id)
      } else {
        reject(new Error(`Upload failed with status: ${res.statusCode}`))
      }
    })

    req.on('error', reject)

    // Stream file directly
    fileStream.pipe(req)
  })
}

// Helper function to guess MIME type (optional but recommended)
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.mp4': 'video/mp4',
  }
  return mimeTypes[ext] || 'application/octet-stream' // Default binary type
}

if (require.main === module) {
  seed()
}
