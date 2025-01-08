import { faker } from '@faker-js/faker/locale/de'
import type { UserInsert } from '../schema'

export function makeUser(): UserInsert {
  return {
    name: faker.internet.username(),
    email: faker.internet.email(),
    roles: ['default-user'],
  }
}
