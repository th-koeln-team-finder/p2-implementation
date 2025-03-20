'use server'

import type { UserWithImage } from '@/features/users/users.types'
import { Schema, db } from '@repo/database'
import type {
  NotificationColumn,
  NotificationType,
} from '@repo/database/constants'
import { type UserSelect, users } from '@repo/database/schema'
import { and, desc, eq, inArray, ne, or, sql } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/dist/server/web/spec-extension/unstable-cache'

export async function checkUsernameTaken(username: string) {
  const result = await db.query.users.findFirst({
    where: eq(Schema.users.name, username),
  })
  return !!result
}

export const getUsers = cache(
  async (projectId: string, limit: number, userId?: string) => {
    const { skillMatchScore, projectTagMatchScore, totalMatchScore } =
      getMatchScores(projectId)
    return await db.query.users.findMany({
      extras: {
        skillMatchScore: skillMatchScore.as('skillMatchScore'),
        projectTagMatchScore: projectTagMatchScore.as('projectTagMatchScore'),
        totalMatchScore: totalMatchScore.as('totalMatchScore'),
      },
      with: {
        image: true,
      },
      limit,
      where: userId ? ne(users.id, userId) : undefined,
      orderBy: [desc(totalMatchScore)],
    })
  },
  ['getUsers'],
  { tags: ['users'] },
)

export const getUser = cache(
  async (id: string): Promise<UserSelect | undefined> =>
    db.query.users.findFirst({
      where: eq(users.id, id),
    }),
  ['getUser'],
  { tags: ['user'] },
)

export const getUserWithImage = cache(
  async (id: string): Promise<UserWithImage | undefined> =>
    db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        image: true,
      },
    }),
  ['getUser'],
  { tags: ['user'] },
)

export const usersWhoWantToReceiveNotificationsByType = async (
  userIds: string[],
  type: NotificationType,
) => {
  const pushColumn: NotificationColumn = `${type}_push`
  const emailColumn: NotificationColumn = `${type}_email`
  return await db.query.users.findMany({
    where: and(
      inArray(users.id, userIds),
      or(
        eq(Schema.users[pushColumn], true),
        eq(Schema.users[emailColumn], true),
      ),
    ),
  })
}

function getMatchScores(projectId: string | undefined) {
  const skillMatchScore = sql<number>`(SELECT COALESCE(MAX((CASE us.level <= ps.level WHEN TRUE THEN (4 - (ps.level - us.level))^4/4^4 ELSE (4 - (us.level - ps.level))^1.4/4^1.4 END)), 0) FROM "projectSkill" ps JOIN "userSkills" us ON ps."skillId" = us."skillId" WHERE ps."projectId" = ${projectId} AND us."userId" = "users"."id")`
  const projectTagMatchScore = sql<number>`COALESCE(((SELECT SUM(filtered_tags.count)
         FROM (SELECT COUNT(DISTINCT tag) * 1.0 as count
               FROM (SELECT tag."tagId" as tag
                     FROM brainstorm_bookmark bookmark
                              JOIN brainstorm_tag tag ON bookmark."brainstormId" = tag."brainstormId"
                     WHERE bookmark."userId" = users.id
                     UNION ALL
                     SELECT tag."tagId" as tag
                     FROM project_bookmark bookmark
                              JOIN project_tag tag ON bookmark."projectId" = tag."projectId"
                     WHERE bookmark."userId" = users.id
                     UNION ALL
                     SELECT tag."tagId" as tag
                     FROM project_star star
                              JOIN project_tag tag ON star."projectId" = tag."projectId"
                     WHERE star."userId" = users.id) as tags
               WHERE tags.tag IN (SELECT "tagId" FROM project_tag pt WHERE pt."projectId" = ${projectId})
               GROUP BY tags.tag
               HAVING count(tags.tag) > 2) filtered_tags) /
        (SELECT GREATEST(COUNT(DISTINCT pt."tagId") * 1.0, 1.0)
         FROM project_tag pt
         WHERE pt."projectId" = ${projectId})), 0)`
  const totalMatchScore = sql<number>`ROUND(CAST((${skillMatchScore} * 2 + ${projectTagMatchScore}) / 3 as numeric), 2)`
  return {
    skillMatchScore,
    projectTagMatchScore,
    totalMatchScore,
  }
}
