import { faker } from '@faker-js/faker/locale/de'
import type { TagInsert } from '../schema'

export function makeTag(uniqueTags: Set<string>): TagInsert | null {
  let tries = 0
  let name = faker.book.genre()

  while (uniqueTags.has(name) && tries < 10) {
    name = faker.book.genre()
    tries++
  }
  tries = 0
  while (uniqueTags.has(name) && tries < 10) {
    name = faker.music.genre()
    tries++
  }

  if (tries >= 10) {
    return null
  }
  uniqueTags.add(name)

  return {
    name,
  }
}
