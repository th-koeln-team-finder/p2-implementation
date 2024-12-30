import { faker } from '@faker-js/faker/locale/de'
import type { ProjectInsert } from '@/schema'

export function makeProject(): ProjectInsert {
  return {
    name: faker.internet.username(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['open', 'closed']),
    isPublic: faker.datatype.boolean(),
    allowApplications: faker.datatype.boolean(),
    additionalInfo: {},
  }
}

export function makeProjects(count: number): ProjectInsert[] {
  return Array.from({ length: count }, makeProject)
}
