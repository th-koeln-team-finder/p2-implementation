import { faker } from '@faker-js/faker/locale/de'
import type { ProjectInsert } from '../schema'

export function makeProject(): ProjectInsert {
  // biome-ignore lint/nursery/noEnum: <explanation>
  enum a {
    open = 'open',
    closed = 'closed',
  }
  return {
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    status: faker.helpers.enumValue(a),
  }
}
