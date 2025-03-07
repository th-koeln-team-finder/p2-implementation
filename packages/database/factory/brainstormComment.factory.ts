import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { BrainstormCommentInsert } from '../schema'

export async function makeBrainstormComment(
  brainstormId: string,
  comment: string,
  createdByIds: string[],
  parentCommentIds?: string[],
): Promise<BrainstormCommentInsert> {
  console.log('Generating embeddings for text: ', comment)
  const embedding = await generateTextEmbeddings(comment)
  return {
    parentCommentId: parentCommentIds
      ? faker.helpers.arrayElement(parentCommentIds)
      : undefined,
    isPinned: faker.datatype.boolean(0.2),
    brainstormId,
    comment,
    embedding,
    createdById: faker.helpers.arrayElement(createdByIds),
    createdAt: faker.date.past(),
  }
}
