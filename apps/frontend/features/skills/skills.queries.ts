'use server'

import { Schema, db } from '@repo/database'
import { desc, gte, sql } from 'drizzle-orm'

export async function searchSkills(input: string, limit = 8) {
  const usedCountUsers = sql<number>`(SELECT COUNT(*) FROM ${Schema.userSkills} uSkill WHERE uSkill."skillId" = ${Schema.skills.id})`
  const usedCountProject = sql<number>`(SELECT COUNT(*) FROM ${Schema.projectSkill} pSkill WHERE pSkill."skillId" = ${Schema.skills.id})`
  const usedCount = sql<number>`(${usedCountUsers}) + (${usedCountProject})`

  const similarity = sql<number>`similarity(${input}, ${Schema.skills.skill})`
  const grossSimilarity = sql<number>`ROUND(CAST(${similarity} AS numeric), 2)`

  return await db.query.skills.findMany({
    extras: {
      grossSimilarity: grossSimilarity.as('grossSimilarity'),
      similarity: similarity.as('similarity'),
      usedCountUsers: usedCountUsers.as('usedCountUsers'),
      usedCountProject: usedCountProject.as('usedCountProject'),
      usedCount: usedCount.as('usedCount'),
    },
    where: input ? gte(similarity, 0.4) : undefined,
    limit,
    orderBy: [input && desc(grossSimilarity), desc(usedCount)].filter(
      (e) => !!e,
    ),
  })
}
