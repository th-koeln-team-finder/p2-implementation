'use server'

import {db} from '@repo/database'
import {desc, eq, getTableColumns, like, sql} from "drizzle-orm";
import {skills, userSkills} from "@repo/database/schema";

export async function searchSkills(input: string) {
  return await db.select({
    ...getTableColumns(skills),
    usedCount: sql<number>`count(${userSkills.id}) as usedCount`,
  })
    .from(skills)
    .leftJoin(userSkills, eq(userSkills.skillId, skills.id))
    .where(like(skills.skill, `%${input}%`))
    .limit(8)
    .groupBy(skills.id)
    .orderBy(desc(sql`usedCount`))
    .execute()
}