import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { BrainstormInsert } from '../schema'

export async function makeBrainstorm(
  userIds: string[],
  brainstormData: {
    title: string
    description: unknown
    descriptionText: string
  },
): Promise<BrainstormInsert> {
  const embedding = await generateTextEmbeddings(
    `${brainstormData.title}\n${brainstormData.descriptionText}`,
  )
  return {
    title: brainstormData.title,
    description: JSON.stringify(brainstormData.description),
    embedding,
    createdById: faker.helpers.arrayElement(userIds),
    createdAt: faker.date.past(),
  }
}
