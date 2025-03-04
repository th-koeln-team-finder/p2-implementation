import { Schema, db } from '@repo/database'
import { projects } from '@repo/database/schema'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getProjectItems = cache(
  async (search = '', limit = 25) => {
    const searchEmbeddings = await generateTextEmbeddings(search)

    const similarity = sql<number>`(1 - (${cosineDistance(Schema.projects.embedding, searchEmbeddings)}))`
    const issueSimilarity = sql<number>`(select COALESCE(max(1 - ("issues"."embedding" <=> ${JSON.stringify(searchEmbeddings)})), NULL) from (select "projectIssue"."embedding" from "projectIssue" where "projectIssue"."projectId" = "projects".id) as "issues")`

    const totalSimilarity = sql<number>`(${similarity} * 2 + ${issueSimilarity}) / 3`
    const totalSimilarityNoIssue = sql<number>`${similarity}`

    const correctTotalSimilarity = sql<number>`CASE WHEN ${issueSimilarity} IS NULL THEN ${totalSimilarityNoIssue} ELSE ${totalSimilarity} END`

    return db.query.projects.findMany({
      extras: {
        totalSimilarity: search
          ? correctTotalSimilarity.as('totalSimilarity')
          : sql<number>`NULL`.as('totalSimilarity'),
        similarity: search
          ? similarity.as('similarity')
          : sql<number>`NULL`.as('similarity'),
        issueSimilarity: search
          ? issueSimilarity.as('issueSimilarity')
          : sql<number>`NULL`.as('issueSimilarity'),
      },
      columns: {
        embedding: false,
      },
      where: and(
        gte(correctTotalSimilarity, 0.6),
        eq(Schema.projects.isPublic, true),
      ),
      limit,
      orderBy: [
        search && desc(correctTotalSimilarity),
        desc(Schema.projects.createdAt),
      ].filter(Boolean),
    })
  },
  ['getProjectItems'],
  { tags: ['projects'] },
)

export const getProjectItem = cache(
  (id: string, userId?: string) =>
    db.query.projects.findFirst({
      extras: {
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "project_bookmark" bookmark WHERE bookmark."projectId" = "projects"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
      },
      where: eq(projects.id, id),
      with: {
        timetable: true,
        issues: true,
        resources: {
          with: {
            uploadedFile: true,
          },
        },
        projectSkills: {
          with: {
            skill: true,
          },
        },
      },
    }),
  ['getProjectItem'],
  { tags: ['projects'] },
)
