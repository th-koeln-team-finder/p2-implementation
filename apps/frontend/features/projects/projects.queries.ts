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

    const projectSkillMatchScore = sql<number>`(SELECT COALESCE(MAX((CASE us.level <= ps.level WHEN TRUE THEN (4 - (ps.level - us.level))^4/4^4 ELSE (4 - (us.level - ps.level))^1.4/4^1.4 END)), 0) FROM "projectSkill" ps JOIN "userSkills" us ON ps."skillId" = us."skillId" WHERE us."userId" = ${userId} AND ps."projectId" = "projects"."id")`

    // const projectTagMatchScoreBrainstormBookmarks = sql<number>`(SELECT COALESCE(SUM(brainstorm_tags.count), 0) FROM project_tag pt JOIN (SELECT tag."tagId", count(*) * 1.0 / SUM(COUNT(*)) OVER () as "count" FROM brainstorm_bookmark bookmark JOIN brainstorm_tag tag ON bookmark."brainstormId" = tag."brainstormId" WHERE bookmark."userId" = ${userId} GROUP BY tag."tagId") brainstorm_tags ON pt."tagId" = brainstorm_tags."tagId" WHERE pt."projectId" = "projects"."id")`
    // const projectTagMatchScoreProjectBookmarks = sql<number>`(SELECT COALESCE(SUM(project_tags.count), 0) FROM project_tag pt JOIN (SELECT tag."tagId", count(*) * 1.0 / SUM(COUNT(*)) OVER () as "count" FROM project_bookmark bookmark JOIN project_tag tag ON bookmark."projectId" = tag."projectId" WHERE bookmark."userId" = ${userId} GROUP BY tag."tagId") project_tags ON pt."tagId" = project_tags."tagId" WHERE pt."projectId" = "projects"."id")`
    // const projectTagMatchScoreProjectStars = sql<number>`(SELECT COALESCE(SUM(project_tags.count), 0) FROM project_tag pt JOIN (SELECT tag."tagId", count(*) * 1.0 / SUM(COUNT(*)) OVER () as "count" FROM project_star star JOIN project_tag tag ON star."projectId" = tag."projectId" WHERE star."userId" = ${userId} GROUP BY tag."tagId") project_tags ON pt."tagId" = project_tags."tagId" WHERE pt."projectId" = "projects"."id")`
    // const projectTagMatchScore = sql<number>`COALESCE(${projectTagMatchScoreBrainstormBookmarks} + ${projectTagMatchScoreProjectBookmarks} + ${projectTagMatchScoreProjectStars}, 0)`
    const projectTagMatchScore = sql<number>`((SELECT COUNT(DISTINCT tag) * 1.0 FROM (SELECT tag."tagId" as tag FROM brainstorm_bookmark bookmark JOIN brainstorm_tag tag ON bookmark."brainstormId" = tag."brainstormId" WHERE bookmark."userId" = ${userId} UNION ALL SELECT tag."tagId" as tag FROM project_bookmark bookmark JOIN project_tag tag ON bookmark."projectId" = tag."projectId" WHERE bookmark."userId" = ${userId} UNION ALL SELECT tag."tagId" as tag FROM project_star star JOIN project_tag tag ON star."projectId" = tag."projectId" WHERE star."userId" = ${userId}) as tags WHERE tags.tag IN (SELECT "tagId" FROM project_tag WHERE "projectId" = "projects"."id")) / (SELECT GREATEST(COUNT(DISTINCT pt."tagId") * 1.0, 1.0) FROM project_tag pt WHERE pt."projectId" = "projects"."id"))`

    const projectTotalMatchScore = sql<number>`ROUND(CAST((${projectSkillMatchScore} + ${projectTagMatchScore}) as numeric), 2)`

    return db.query.projects.findMany({
      extras: {
        projectTotalMatchScore: userId
          ? projectTotalMatchScore.as('projectTotalMatchScore')
          : sql<number>`NULL`.as('projectTotalMatchScore'),
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
            users: true,
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
