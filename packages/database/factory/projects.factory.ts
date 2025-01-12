import type { ProjectInsert } from '@/schema'
import { faker } from '@faker-js/faker/locale/de'

export function makeProject(): ProjectInsert {
  return {
    name: faker.internet.username(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['open', 'closed']),
    isPublic: faker.datatype.boolean(),
    allowApplications: faker.datatype.boolean(),
  }
}
