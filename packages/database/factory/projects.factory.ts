import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { ProjectInsert } from '../schema'

export async function makeProject(
  userIds: string[],
  projectData: {
    name: string
    description: unknown
    status: 'open'
    descriptionText: string
    isPublic?: boolean
    allowApplications?: boolean
  },
): Promise<ProjectInsert> {
  const embedding = await generateTextEmbeddings(
    `${projectData.name}\n${projectData.descriptionText}`,
  )
  return {
    name: projectData.name,
    description: JSON.stringify(projectData.description),
    embedding,
    status: projectData.status,
    createdAt: faker.date.past(),
    createdBy: faker.helpers.arrayElement(userIds),
    isPublic: projectData.isPublic ?? true,
    allowApplications: projectData.allowApplications ?? true,
  }
}
