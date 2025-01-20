'use server'

import {revalidateTag} from "next/cache";
import {UserSkillsInsert} from "@repo/database/schema";
import {db, Schema} from "@repo/database";
import {eq} from "drizzle-orm";

export async function revalidateSkills() {
  return revalidateTag('user-skills')
}

export async function addUserSkill(userSkill: UserSkillsInsert) {
  await db
    .insert(Schema.userSkills)
    .values(userSkill)
    .execute()
}

export async function updateUserSkillLevel(userSkillId: number, level: number) {
  await db
    .update(Schema.userSkills)
    .set({level})
    .where(eq(Schema.userSkills.id, userSkillId))
    .execute()
}

export async function removeUserSkill(userSkillId: number) {
  await db
    .delete(Schema.userSkills)
    .where(eq(Schema.userSkills.id, userSkillId))
    .execute()
}