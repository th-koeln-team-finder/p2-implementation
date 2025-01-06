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
    isPinned: faker.datatype.boolean(0.1),
    brainstormId: faker.helpers.arrayElement(brainstormIds),
    comment: faker.lorem.paragraph(),
    createdById: faker.helpers.arrayElement(createdByIds),
    createdAt: faker.date.past(),
  }
}
