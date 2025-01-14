'use server'

import {getUserProjects} from "@/features/users/users.query";
import {db, Schema} from "@repo/database";
import {UserInsert, UserSkillsInsert} from "@repo/database/schema";
import {eq} from "drizzle-orm";
import {revalidateTag} from "next/cache";

export async function loadMoreProjects(count = 10, offset = 0) {
  return await getUserProjects(1, count, offset)
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

export async function updateUserData(user: Partial<UserInsert>) {
  await db
    .update(Schema.users)
    .set(user)
    .where(eq(Schema.users.id, user.id!))
    .execute()
}

export async function revalidateUser() {
  return revalidateTag('users')
}