'use server'

import { Schema, db } from '@repo/database'
import { and, eq } from 'drizzle-orm'

export async function verifyUserSkill(userId: string, userSkillId: number) {
  await db
    .insert(Schema.userSkillVerification)
    .values({
      verifierId: userId,
      userSkillId,
    })
    .execute()
}

export async function unverifyUserSkill(userId: string, userSkillId: number) {
  await db
    .delete(Schema.userSkillVerification)
    .where(
      and(
        eq(Schema.userSkillVerification.userSkillId, userSkillId),
        eq(Schema.userSkillVerification.verifierId, userId),
      ),
    )
    .execute()
}

export async function resetVerification(userSkillId: number) {
  await db
    .delete(Schema.userSkillVerification)
    .where(eq(Schema.userSkillVerification.userSkillId, userSkillId))
    .execute()
}
