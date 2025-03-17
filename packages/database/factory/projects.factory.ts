import { faker } from '@faker-js/faker/locale/de'
import type { ProjectInsert } from '../schema'
import { generateTextEmbeddings } from '@repo/semantic-search'

export async function makeProject(
  name: string,
  description: string,
  descriptionText: string,
  status: 'open',
  userIds: string[],
): Promise<ProjectInsert> {
  const embedding = await generateTextEmbeddings(`${name}\n${descriptionText}`)
  return {
    name,
    description,
    embedding,
    status,
    createdAt: faker.date.past(),
    createdBy: faker.helpers.arrayElement(userIds),
  }
}
