import { faker } from '@faker-js/faker/locale/de'
import type { UserProjectsInsert } from '../schema'

export function makeUserProjects(
  userIds: string[],
  projectIds: string[],
  uniqueIds: Set<string>,
): UserProjectsInsert | null {
  let tries = 0
  let userId = faker.helpers.arrayElement(userIds)
  let projectId = faker.helpers.arrayElement(projectIds)

  while (projectId && uniqueIds.has(`${userId}-${projectId}`) && tries < 10) {
    userId = faker.helpers.arrayElement(userIds)
    projectId = faker.helpers.arrayElement(projectIds)
    tries++
  }
  if (tries >= 10) {
    return null
  }

  uniqueIds.add(`${userId}-${projectId}`)

  return {
    userId,
    projectId,
    projectJoinedDate: faker.date.past().toDateString(),
    projectLeftDate: faker.date.future().toDateString(),
    projectName: faker.company.name(),
    projectDescription: faker.lorem.sentence(),
    visible: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
}
