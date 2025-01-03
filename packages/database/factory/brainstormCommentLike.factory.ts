import { faker } from '@faker-js/faker/locale/de'
import type { BrainstormCommentLikeInsert } from '../schema'

export function makeBrainstormCommentLike(
  brainstormCommentIds: string[],
  createdByIds: string[],
  uniqueIds: Set<string>,
): BrainstormCommentLikeInsert | null {
  let tries = 0
  let commentId = faker.helpers.arrayElement(brainstormCommentIds)
  let userId = faker.helpers.arrayElement(createdByIds)

  while (uniqueIds.has(`${commentId}-${userId}`) && tries < 10) {
    commentId = faker.helpers.arrayElement(brainstormCommentIds)
    userId = faker.helpers.arrayElement(createdByIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }

  uniqueIds.add(`${commentId}-${userId}`)

  return {
    commentId,
    userId,
    createdAt: faker.date.past(),
  }
}
