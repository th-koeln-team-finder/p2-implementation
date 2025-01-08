import { faker } from '@faker-js/faker/locale/de'
import type { BrainstormTagInsert } from '../schema'

export function makeBrainstormTag(
  tagIds: string[],
  brainstormIds: string[],
  uniqueIds: Set<string>,
): BrainstormTagInsert | null {
  let tries = 0
  let tagId = faker.helpers.arrayElement(tagIds)
  let brainstormId = faker.helpers.arrayElement(brainstormIds)

  while (uniqueIds.has(`${tagId}-${brainstormId}`) && tries < 10) {
    tagId = faker.helpers.arrayElement(tagIds)
    brainstormId = faker.helpers.arrayElement(brainstormIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }

  uniqueIds.add(`${tagId}-${brainstormId}`)

  return {
    tagId,
    brainstormId,
  }
}
