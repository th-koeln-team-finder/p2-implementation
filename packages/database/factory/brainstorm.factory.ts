import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { BrainstormInsert } from '../schema'

export async function makeBrainstorm(
  title: string,
  description: string,
  descriptionText: string,
  createdByIds: string[],
): Promise<BrainstormInsert> {
  const embedding = await generateTextEmbeddings(`${title}\n${descriptionText}`)
  return {
    title,
    description,
    embedding,
    createdById: faker.helpers.arrayElement(createdByIds),
    createdAt: faker.date.past(),
  }
}
