import { faker } from '@faker-js/faker/locale/de'
import type { UserSkillVerificationInsert } from '../schema'

export function makeUserSkillVerification(
  userSkillIds: string[],
  verifierIds: string[],
  uniqueIds: Set<string>,
): UserSkillVerificationInsert | null {
  let tries = 0
  let userSkillId = faker.helpers.arrayElement(userSkillIds)
  let verifierId = faker.helpers.arrayElement(verifierIds)

  while (uniqueIds.has(`${userSkillId}-${verifierId}`) && tries < 10) {
    userSkillId = faker.helpers.arrayElement(userSkillIds)
    verifierId = faker.helpers.arrayElement(verifierIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }

  uniqueIds.add(`${userSkillId}-${verifierId}`)

  return {
    userSkillId,
    verifierId,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
}
