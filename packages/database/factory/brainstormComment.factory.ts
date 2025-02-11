import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { BrainstormCommentInsert } from '../schema'
import { BrainstormExampleData } from './brainstorm.factory'

export async function makeBrainstormComment(
  brainstormIds: string[],
  createdByIds: string[],
  parentCommentIds?: string[],
): Promise<BrainstormCommentInsert> {
  const [, , comments] = faker.helpers.arrayElement(BrainstormExampleData)
  const comment = faker.helpers.arrayElement(comments)
  console.log('Generating embeddings for text: ', comment)
  const embedding = await generateTextEmbeddings(comment)
  return {
    parentCommentId: parentCommentIds
      ? faker.helpers.arrayElement(parentCommentIds)
      : undefined,
    isPinned: faker.datatype.boolean(0.1),
    brainstormId: faker.helpers.arrayElement(brainstormIds),
    comment,
    embedding,
    createdById: faker.helpers.arrayElement(createdByIds),
    createdAt: faker.date.past(),
  }
}
