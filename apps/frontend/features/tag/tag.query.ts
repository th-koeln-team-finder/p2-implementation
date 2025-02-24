'use server'
import { Schema, db } from '@repo/database'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { cosineDistance, desc, gte, sql } from 'drizzle-orm'

export async function getTagSearchResults(searchTerm: string, limit = 25) {
  const searchEmbeddings = await generateTextEmbeddings(searchTerm, 'small')
  const similarity = sql<number>`(1 - (${cosineDistance(Schema.tags.embedding, searchEmbeddings)}))`
  // Only get the 0.X precision of similarity
  const grossSimilarity = sql<number>`ROUND(CAST(${similarity} AS numeric), 2)`

  const usage =
    sql<number>`(SELECT count(*) FROM "brainstorm_tag" WHERE "tags"."id" = "brainstorm_tag"."tagId")`.as(
      'usage',
    )

  return await db.query.tags.findMany({
    extras: {
      grossSimilarity: grossSimilarity.as('grossSimilarity'),
      similarity: similarity.as('similarity'),
      usage,
    },
    limit,
    orderBy: [searchTerm && desc(grossSimilarity), desc(usage)].filter(
      (e) => !!e,
    ),
    where: searchTerm ? gte(similarity, 0.6) : undefined,
  })
}
