import { faker } from '@faker-js/faker/locale/de'
import type { UserFollowsInsert } from '../schema'

export function makeUserFollows(
  followerIds: string[],
  followeeIds: string[],
  uniqueIds: Set<string>,
): UserFollowsInsert | null {
  let tries = 0
  let followerId = faker.helpers.arrayElement(followerIds)
  let followeeId = faker.helpers.arrayElement(followeeIds)

  while (uniqueIds.has(`${followerId}-${followeeId}`) && tries < 10) {
    followerId = faker.helpers.arrayElement(followerIds)
    followeeId = faker.helpers.arrayElement(followeeIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }

  uniqueIds.add(`${followerId}-${followeeId}`)

  return {
    followerId,
    followeeId,
    createdAt: faker.date.past(),
  }
}
