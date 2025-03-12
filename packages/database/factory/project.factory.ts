import { faker } from '@faker-js/faker/locale/de'
import type { ProjectInsert } from '../schema'
import {generateTextEmbeddings} from "@repo/semantic-search";

export function makeProject(): ProjectInsert {
  // biome-ignore lint/nursery/noEnum: <explanation>
  enum a {
    open = 'open',
    closed = 'closed',
  }

  const name=faker.lorem.words(3)
  const descriptionTextValue=faker.lorem.sentence()

  return {
    name: name,
    description: descriptionTextValue,
    status: 'open',
  }
}
