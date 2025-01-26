import type { ProjectSkillInsert, SkillInsert } from '@/schema'
import { faker } from '@faker-js/faker/locale/de'

export function makeSkill(): SkillInsert {
  return {
    name: faker.person.jobArea(),
  }
}

export function makeProjectSkill(
  projectId: string,
  skillIds: string[],
  uniqueIds: Set<string>,
): ProjectSkillInsert | null {
  let tries = 0
  let skillId = faker.helpers.arrayElement(skillIds)

  while (uniqueIds.has(`${projectId}-${skillId}`) && tries < 10) {
    skillId = faker.helpers.arrayElement(skillIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }
  uniqueIds.add(`${projectId}-${skillId}`)

  return {
    projectId,
    skillId,
    level: faker.number.int(5),
    name: faker.person.jobArea(),
  }
}
