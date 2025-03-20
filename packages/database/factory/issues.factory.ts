import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { ProjectIssueInsert } from '../schema'

export async function makeIssue(issueData: {
  projectId: string
  title: string
  description: string
}): Promise<ProjectIssueInsert> {
  const embedding = await generateTextEmbeddings(
    `${issueData.title}\n${issueData.description}`,
  )
  return {
    projectId: issueData.projectId,
    title: issueData.title,
    description: issueData.description,
    embedding,
    createdAt: faker.date.past(),
  }
}
