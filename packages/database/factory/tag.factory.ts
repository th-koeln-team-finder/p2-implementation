import { generateTextEmbeddings } from '@repo/semantic-search'
import type { TagInsert } from '../schema'

export async function makeTag(name: string): Promise<TagInsert> {
  const embedding = await generateTextEmbeddings(name, 'small')
  return {
    name,
    embedding,
  }
}
