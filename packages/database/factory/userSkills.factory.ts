import { faker } from '@faker-js/faker/locale/de'
import type { UserSkillsInsert } from '../schema'

export function makeUserSkills(
  userIds: string[],
  skillIds: string[],
  uniqueIds: Set<string>,
): UserSkillsInsert | null {
  let tries = 0
  let userId = faker.helpers.arrayElement(userIds)
  let skillId = faker.helpers.arrayElement(skillIds)

  while (uniqueIds.has(`${userId}-${skillId}`) && tries < 10) {
    userId = faker.helpers.arrayElement(userIds)
    skillId = faker.helpers.arrayElement(skillIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }

  uniqueIds.add(`${userId}-${skillId}`)

  return {
    userId,
    skillId,
    level: faker.number.int({ min: 0, max: 5 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
}
