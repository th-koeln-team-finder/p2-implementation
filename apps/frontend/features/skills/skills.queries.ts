'use server'

import { db } from '@repo/database'
import { skills, userSkills } from '@repo/database/schema'
import { desc, eq, getTableColumns, ilike } from 'drizzle-orm'
import { count } from 'drizzle-orm/sql/functions/aggregate'

export async function searchSkills(input: string) {
  return await db
    .select({
      ...getTableColumns(skills),
      usedCount: count(userSkills.id).as('usedCount'),
    })
    .from(skills)
    .leftJoin(userSkills, eq(userSkills.skillId, skills.id))
    .where(ilike(skills.skill, `%${input}%`))
    .limit(8)
    .groupBy(skills.id)
    .orderBy(({ usedCount }) => desc(usedCount))
    .execute()
}
