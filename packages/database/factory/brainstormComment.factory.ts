import { faker } from '@faker-js/faker/locale/de'
import type { BrainstormCommentInsert } from '../schema'

export function makeBrainstormComment(
  brainstormIds: string[],
  createdByIds: string[],
  parentCommentIds?: string[],
): BrainstormCommentInsert {
  return {
    parentCommentId: parentCommentIds
      ? faker.helpers.arrayElement(parentCommentIds)
      : undefined,
    brainstormId: faker.helpers.arrayElement(brainstormIds),
    comment: faker.lorem.paragraph(),
    createdById: faker.helpers.arrayElement(createdByIds),
    createdAt: faker.date.past(),
  }
}
