import { faker } from '@faker-js/faker/locale/de'
import type { ProjectSkillInsert, SkillsInsert } from '../schema'

const uniqueSkills = new Set<string>()

export function makeSkill(): SkillsInsert {
  let tries = 0
  let skill = `${faker.person.jobArea()} ${faker.person.jobType()}`

  while (uniqueSkills.has(skill) && tries < 10) {
    skill = `${faker.person.jobArea()} ${faker.person.jobType()}`
    tries++
  }

  uniqueSkills.add(skill)

  return {
    skill,
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
