'use server'

import { Schema, db } from '@repo/database'
import type { SkillsInsert } from '@repo/database/schema'

export async function addSkill(skill: SkillsInsert) {
  return (await db.insert(Schema.skills).values(skill).returning())[0].id
}
