import { faker } from '@faker-js/faker/locale/de'
import type { ProjectInsert } from '../schema'

export function makeProject(): ProjectInsert {
  return {
    name: faker.internet.username(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['open', 'closed']),
    phase: faker.lorem.word(),
    location: faker.location.city(),
    isPublic: faker.datatype.boolean(),
    allowApplications: faker.datatype.boolean(),
  }
}
