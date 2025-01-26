'use server'

import { Schema, db } from '@repo/database'
import type { SkillsInsert } from '@repo/database/schema'
import { revalidateTag } from 'next/cache'

export async function addSkill(skill: SkillsInsert) {
  return (await db.insert(Schema.skills).values(skill).returning())[0].id
}

export async function revalidateSkills() {
  return revalidateTag('user-skills')
}
