import { faker } from '@faker-js/faker/locale/de'
import type { BrainstormResourceInsert } from '../schema'

export function makeBrainstormResource(
  brainstormIds: string[],
): BrainstormResourceInsert {
  const brainstormId = faker.helpers.arrayElement(brainstormIds)
  return {
    brainstormId,
    type: 'link', // Currently there is no easy way to upload a file during seeding
    label: faker.lorem.words(3),
    value: faker.internet.url({ protocol: 'https' }),
  }
}
