import { FilterKeys } from '@/features/projects/components/FilterBar/filterbar.constants'
import type { parseFilters } from '@/features/projects/components/FilterBar/filterbar.utils'
import { Schema, db } from '@repo/database'
import { projects } from '@repo/database/schema'
import { generateTextEmbeddings } from '@repo/semantic-search'
import { and, cosineDistance, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getProjectItems = cache(
  async (
    search,
    filters: ReturnType<typeof parseFilters>,
    limit: number,
    userId?: string,
  ) => {
    const searchEmbeddings = await generateTextEmbeddings(search ?? '')

    const similarity = sql<number>`(1 - (${cosineDistance(Schema.projects.embedding, searchEmbeddings)}))`
    const issueSimilarity = sql<number>`(select COALESCE(max(1 - ("issues"."embedding" <=> ${JSON.stringify(searchEmbeddings)})), NULL) from (select "projectIssue"."embedding" from "projectIssue" where "projectIssue"."projectId" = "projects".id) as "issues")`
    const totalSimilarity = sql<number>`(${similarity} * 2 + ${issueSimilarity}) / 3`
    const totalSimilarityNoIssue = sql<number>`${similarity}`
    const correctTotalSimilarity = sql<number>`CASE WHEN ${issueSimilarity} IS NULL THEN ${totalSimilarityNoIssue} ELSE ${totalSimilarity} END`
    const grossSimilarity = sql<number>`ROUND(CAST(${correctTotalSimilarity} AS numeric), 2)`

    const participantCount = sql<number>`(SELECT COUNT(*) FROM participants WHERE "participants"."projectId" = "projects"."id")`

    const minMembersFilterValue = filters[FilterKeys.minTeamSize]
    const maxMembersFilterValue = filters[FilterKeys.maxTeamSize]
    const minMembersFilter =
      minMembersFilterValue !== null
        ? gte(participantCount, minMembersFilterValue)
        : sql`true`
    const maxMembersFilter =
      maxMembersFilterValue !== null
        ? lte(participantCount, maxMembersFilterValue)
        : sql`true`
    const membersFilter = and(minMembersFilter, maxMembersFilter)

    const projectStars = sql<string>`(SELECT COUNT(*) FROM "project_star" star WHERE star."projectId" = "projects"."id")`

    const minStarsFilterValue = filters[FilterKeys.minStars]
    const minStarsFilter =
      minStarsFilterValue !== null
        ? gte(projectStars, minStarsFilterValue)
        : sql`true`

    const minDateFilterValue = filters[FilterKeys.minCreationDate]
    const maxDateFilterValue = filters[FilterKeys.maxCreationDate]
    const minCreationDateFilter =
      minDateFilterValue !== null
        ? gte(Schema.projects.createdAt, minDateFilterValue)
        : sql`true`
    const maxCreationDateFilter =
      maxDateFilterValue !== null
        ? lte(Schema.projects.createdAt, maxDateFilterValue)
        : sql`true`
    const creationDateFilter = and(minCreationDateFilter, maxCreationDateFilter)

    const skillRequirementsFilterValue = filters[FilterKeys.skillRequirements]
    const skillFilters = skillRequirementsFilterValue.map(
      (skill) =>
        sql`(EXISTS (SELECT id FROM "projectSkill" skill WHERE skill."projectId" = "projects"."id" AND skill."skillId" = ${skill.value} AND skill."level" >= ${skill.level}))`,
    )
    const skillFilter = skillFilters.length ? and(...skillFilters) : sql`true`

    const baseProjectSkillMatchScore = 10
    const levelAboveWeight = 2
    const levelBelowWeight = -5
    const projectSkillMatchScoreRaw = sql<number>`(SELECT SUM(${baseProjectSkillMatchScore} + GREATEST((us.level - ps.level) * ${levelAboveWeight}, ${levelBelowWeight} * (ps.level - us.level))) FROM "projectSkill" ps JOIN "userSkills" us ON ps."skillId" = us."skillId" WHERE us."userId" = ${userId} AND ps."projectId" = "projects"."id")`
    const projectSkillMatchScore = sql<number>`CASE WHEN ${projectSkillMatchScoreRaw} IS NULL THEN 0 ELSE ${projectSkillMatchScoreRaw} END`

    return db.query.projects.findMany({
      extras: {
        projectSkillMatchScore: userId
          ? projectSkillMatchScore.as('projectSkillMatchScore')
          : sql<number>`NULL`.as('projectSkillMatchScore'),
        isBookmarked: !userId
          ? sql<boolean>`false`.as('isBookmarked')
          : sql<boolean>`EXISTS (SELECT id FROM "project_bookmark" bookmark WHERE bookmark."projectId" = "projects"."id" AND bookmark."userId" = ${userId})`.as(
              'isBookmarked',
            ),
        isStared: !userId
          ? sql<boolean>`false`.as('isStared')
          : sql<boolean>`EXISTS (SELECT id FROM "project_star" star WHERE star."projectId" = "projects"."id" AND star."userId" = ${userId})`.as(
              'isStared',
            ),
        participantCount: participantCount.as('participantCount'),
        projectStars: projectStars.as('projectStars'),
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
      with: {
        projectPictures: {
          with: {
            uploadedFile: true,
          },
        },
      },
      where: and(
        search ? gte(correctTotalSimilarity, 0.4) : sql`true`,
        eq(Schema.projects.isPublic, true),
        creationDateFilter,
        membersFilter,
        minStarsFilter,
        skillFilter,
      ),
      limit,
      orderBy: [
        search && desc(grossSimilarity),
        desc(projectSkillMatchScore),
        desc(projectStars),
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
        isStared: !userId
          ? sql<boolean>`false`.as('isStared')
          : sql<boolean>`EXISTS (SELECT id FROM "project_star" star WHERE star."projectId" = "projects"."id" AND star."userId" = ${userId})`.as(
              'isStared',
            ),
        starCount: !userId
          ? sql<string>`0`.as('starCount')
          : sql<string>`(SELECT COUNT(*) FROM "project_star" star WHERE star."projectId" = "projects"."id")`.as(
              'starCount',
            ),
      },
      where: eq(projects.id, id),
      with: {
        issues: true,
        timetable: true,
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
        participants: {
          with: {
            users: true,
          },
        },
        projectPictures: {
          with: {
            uploadedFile: true,
          },
        },
        /*
              tags: true,


               */
      },
    }),
  ['getProjectItem'],
  { tags: ['projects'] },
)
