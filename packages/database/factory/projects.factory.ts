import { faker } from '@faker-js/faker/locale/de'
import type { ProjectInsert } from '../schema'

export function makeProject(): ProjectInsert {
  return {
    name: faker.internet.username(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['open', 'closed']),
    createdAt: faker.date.recent().toString(),
    updatedAt: faker.date.recent().toString(),
    isPublic: faker.datatype.boolean(),
    allowApplications: faker.datatype.boolean(),
    additionalInfo: {},
  }
}

export function makeProjects(count: number): ProjectInsert[] {
  return Array.from({ length: count }, makeProject)
}
