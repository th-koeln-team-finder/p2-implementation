'use server'

import {db, Schema} from "@repo/database";
import {SkillsInsert} from "@repo/database/schema";

export async function addSkill(skill: SkillsInsert) {
  return (await db
    .insert(Schema.skills)
    .values(skill)
    .returning())[0]
}