import { FilterKeys } from '@/features/projects/components/FilterBar/filterbar.constants'

import type { parseFilters } from '@/features/projects/components/FilterBar/filterbar.utils'
import { Schema, db } from '@repo/database'
import { projects } from '@repo/database/schema'
import { generateTextEmbeddings } from '@repo/semantic-search'
import {
  type SQL,
  and,
  cosineDistance,
  desc,
  eq,
  gte,
  lte,
  or,
  sql,
} from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

type FilterParams = ReturnType<typeof parseFilters>

export const getProjectItems = cache(
  async (
    search: string,
    filters: FilterParams,
    limit: number,
    userId?: string,
  ) => {
    const searchEmbeddings = await generateTextEmbeddings(search ?? '', 'large')
    const tagSearchEmbeddings = await generateTextEmbeddings(
      search ?? '',
      'small',
    )

    const {
      similarity,
      issueSimilarity,
      tagSimilarity,
      correctTotalSimilarity,
      grossSimilarity,
    } = getSimilarityScores(searchEmbeddings, tagSearchEmbeddings)

    const {
      projectTotalMatchScore,
      projectTagMatchScore,
      projectSkillMatchScore,
    } = getMatchScores(userId)

    const {
      participantCount,
      projectStars,
      minStarsFilter,
      creationDateFilter,
      membersFilter,
      skillFilter,
    } = getProjectFilters(filters)

    return db.query.projects.findMany({
      extras: {
        projectTotalMatchScore: userId
          ? projectTotalMatchScore.as('projectTotalMatchScore')
          : sql<number>`NULL`.as('projectTotalMatchScore'),
        projectTagMatchScore: userId
          ? projectTagMatchScore.as('projectTagMatchScore')
          : sql<number>`NULL`.as('projectTagMatchScore'),
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
        tagSimilarity: search
          ? tagSimilarity.as('tagSimilarity')
          : sql<number>`NULL`.as('tagSimilarity'),
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
        tags: {
          with: {
            tag: {
              columns: {
                embedding: false,
              },
            },
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
        userId && desc(projectTotalMatchScore),
        desc(projectStars),
      ].filter((e) => !!e),
    })
  },
  ['getProjectItems'],
  { tags: ['projects'] },
)

export const getProjectItemsForUser = cache(
  async (userId: string, limit: number) => {
    const isBookmarked = sql<boolean>`EXISTS (SELECT id FROM "project_bookmark" bookmark WHERE bookmark."projectId" = "projects"."id" AND bookmark."userId" = ${userId})`
    const isStared = sql<boolean>`EXISTS (SELECT id FROM "project_star" star WHERE star."projectId" = "projects"."id" AND star."userId" = ${userId})`
    const projectStars = sql<string>`(SELECT COUNT(*) FROM "project_star" star WHERE star."projectId" = "projects"."id")`
    return await db.query.projects.findMany({
      columns: {
        embedding: false,
      },
      extras: {
        isBookmarked: isBookmarked.as('isBookmarked'),
        isStared: isStared.as('isStared'),
        projectStars: projectStars.as('projectStars'),
      },
      with: {
        projectPictures: {
          with: {
            uploadedFile: true,
          },
        },
        tags: {
          with: {
            tag: true,
          },
        },
      },
      where: or(
        eq(Schema.projects.createdBy, userId),
        eq(isBookmarked, true),
        eq(isStared, true),
        sql`EXISTS (SELECT id FROM "participants" participant WHERE participant."projectId" = "projects"."id" AND participant."userId" = ${userId})`,
      ),
      limit,
      orderBy: [desc(Schema.projects.createdAt)].filter(Boolean),
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
        impressionCount:
          sql<number>`(SELECT COUNT(*) FROM "project_impressions" impression WHERE impression."projectId" = "projects"."id")`.as(
            'impressionCount',
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
        tags: {
          with: {
            tag: {
              columns: {
                embedding: false,
              },
            },
          },
        },
        projectSkills: {
          with: {
            skill: true,
          },
        },
        participants: {
          with: {
            users: {
              with: {
                image: true,
              },
            },
          },
        },
        projectPictures: {
          with: {
            uploadedFile: true,
          },
        },
      },
    }),
  ['getProjectItem'],
  { tags: ['projects'] },
)

export const addProjectImpression = async (projectId: string) => {
  await db.insert(Schema.projectImpressions).values({
    projectId,
  })
}

function getSimilarityScores(
  searchEmbeddings: number[],
  tagSearchEmbeddings: number[],
) {
  const similarity = sql<number>`(1 - (${cosineDistance(Schema.projects.embedding, searchEmbeddings)}))`
  const issueSimilarity = sql<number>`(select COALESCE(max(1 - ("issues"."embedding" <=> ${JSON.stringify(searchEmbeddings)})), NULL) from (select "projectIssue"."embedding" from "projectIssue" where "projectIssue"."projectId" = "projects".id) as "issues")`
  const tagSimilarity = sql<number>`(select COALESCE(max(1 - ("tags"."embedding" <=> ${JSON.stringify(tagSearchEmbeddings)})), NULL) from (select "tag"."embedding" from "project_tag" left join "tag" on "project_tag"."tagId" = "tag".id where "project_tag"."projectId" = "projects".id) as "tags")`

  const totalSimilarity = sql<number>`(${similarity} * 2 + ${issueSimilarity} + (1 / (0.79 + EXP(-11.4*${tagSimilarity} + 9.75)))) / 4`
  const totalSimilarityNoIssue = sql<number>`(${similarity} * 2 + (1 / (0.79 + EXP(-11.4*${tagSimilarity} + 9.75)))) / 3`
  const totalSimilarityNoTag = sql<number>`(${similarity} * 2 + ${issueSimilarity}) / 3`
  const totalSimilarityNoIssueTag = sql<number>`${similarity}`

  const correctTotalSimilarity = sql<number>`CASE WHEN ${issueSimilarity} IS NULL AND ${tagSimilarity} IS NULL THEN ${totalSimilarityNoIssueTag} WHEN ${issueSimilarity} IS NULL THEN ${totalSimilarityNoIssue} WHEN ${tagSimilarity} IS NULL THEN ${totalSimilarityNoTag} ELSE ${totalSimilarity} END`
  const grossSimilarity = sql<number>`ROUND(CAST(${correctTotalSimilarity} AS numeric), 2)`
  return {
    similarity,
    issueSimilarity,
    tagSimilarity,
    correctTotalSimilarity,
    grossSimilarity,
  }
}

function getMatchScores(userId: string | undefined) {
  const projectSkillMatchScore = sql<number>`(SELECT COALESCE(MAX((CASE us.level <= ps.level WHEN TRUE THEN (4 - (ps.level - us.level))^4/4^4 ELSE (4 - (us.level - ps.level))^1.4/4^1.4 END)), 0) FROM "projectSkill" ps JOIN "userSkills" us ON ps."skillId" = us."skillId" WHERE us."userId" = ${userId} AND ps."projectId" = "projects"."id")`
  const projectTagMatchScore = sql<number>`COALESCE(((SELECT SUM(filtered_tags.count)
         FROM (SELECT COUNT(DISTINCT tag) * 1.0 as count
               FROM (SELECT tag."tagId" as tag
                     FROM brainstorm_bookmark bookmark
                              JOIN brainstorm_tag tag ON bookmark."brainstormId" = tag."brainstormId"
                     WHERE bookmark."userId" = ${userId}
                     UNION ALL
                     SELECT tag."tagId" as tag
                     FROM project_bookmark bookmark
                              JOIN project_tag tag ON bookmark."projectId" = tag."projectId"
                     WHERE bookmark."userId" = ${userId}
                     UNION ALL
                     SELECT tag."tagId" as tag
                     FROM project_star star
                              JOIN project_tag tag ON star."projectId" = tag."projectId"
                     WHERE star."userId" = ${userId}) as tags
               WHERE tags.tag IN (SELECT "tagId" FROM project_tag pt WHERE pt."projectId" = "projects"."id")
               GROUP BY tags.tag
               HAVING count(tags.tag) > 2) filtered_tags) /
        (SELECT GREATEST(COUNT(DISTINCT pt."tagId") * 1.0, 1.0)
         FROM project_tag pt
         WHERE pt."projectId" = "projects"."id")), 0)`
  const projectTotalMatchScore = sql<number>`ROUND(CAST((${projectSkillMatchScore} + ${projectTagMatchScore} * 2) / 3 as numeric), 2)`
  return {
    projectSkillMatchScore,
    projectTagMatchScore,
    projectTotalMatchScore,
  }
}

function getProjectFilters(filters: FilterParams) {
  const participantCount = sql<number>`(SELECT COUNT(*) FROM participants WHERE "participants"."projectId" = "projects"."id")`
  const projectStars = sql<string>`(SELECT COUNT(*) FROM "project_star" star WHERE star."projectId" = "projects"."id")`
  const minStarsFilter = getStarFilter(filters, projectStars)
  const creationDateFilter = getCreationDateFilter(filters)
  const membersFilter = getMemberFilter(filters, participantCount)
  const skillFilter = getSkillFilter(filters)
  return {
    participantCount,
    projectStars,
    minStarsFilter,
    creationDateFilter,
    membersFilter,
    skillFilter,
  }
}

function getMemberFilter(filters: FilterParams, participantCount: SQL<number>) {
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
  return and(minMembersFilter, maxMembersFilter)
}

function getStarFilter(filters: FilterParams, projectStars: SQL<string>) {
  const minStarsFilterValue = filters[FilterKeys.minStars]
  return minStarsFilterValue !== null
    ? gte(projectStars, minStarsFilterValue)
    : sql`true`
}

function getCreationDateFilter(filters: FilterParams) {
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
  return and(minCreationDateFilter, maxCreationDateFilter)
}

function getSkillFilter(filters: FilterParams) {
  const skillRequirementsFilterValue = filters[FilterKeys.skillRequirements]
  const skillFilters = skillRequirementsFilterValue.map(
    (skill) =>
      sql`(EXISTS (SELECT id FROM "projectSkill" skill WHERE skill."projectId" = "projects"."id" AND skill."skillId" = ${skill.value} AND skill."level" >= ${skill.level}))`,
  )
  return skillFilters.length ? and(...skillFilters) : sql`true`
}
