'use server'
import { Schema, db } from '@repo/database'
import { ilike } from 'drizzle-orm'

export async function getTagSearchResults(searchTerm: string, limit = 25) {
  return await db.query.tags.findMany({
    limit,
    where: ilike(Schema.tags.name, `%${searchTerm}%`),
  })
}
