import type { TestInsert } from '@/schema'
import { faker } from '@faker-js/faker/locale/de'

export function makeTest(): TestInsert {
  return {
    name: faker.internet.username(),
    checked: faker.datatype.boolean(),
  }
}

export function makeTests(count: number): TestInsert[] {
  return Array.from({ length: count }, makeTest)
}
