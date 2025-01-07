'use server'

import {getUserProjects} from "@/features/users/users.query";
import {db, Schema} from "@repo/database";
import {UserSkillsInsert} from "@repo/database/schema";

export async function loadMoreProjects(count = 10, offset = 0) {
  return await getUserProjects(1, count, offset)
}

export async function addUserSkill(userSkill: UserSkillsInsert) {
  return await db
    .insert(Schema.userSkills)
    .values(userSkill)
    .execute()
}