'use server'

import { Schema, db } from '@repo/database'
import { and, eq } from 'drizzle-orm'
import {sendNotificationByType} from "@/features/notifications/notifications.actions";
import {getTranslations} from "next-intl/server";

export async function verifyUserSkill(userId: string, userSkillId: string) {
  await db
    .insert(Schema.userSkillVerification)
    .values({
      verifierId: userId,
      userSkillId,
    })

  const translate = await getTranslations('notifications.newSkillEvaluation')

  const userSkill = await db.query.userSkills.findFirst({
    where: eq(Schema.userSkills.id, userSkillId),
    with: {
      skill: true,
    }
  })

  if (userSkill) {
    await sendNotificationByType([userSkill.userId], 'newSkillEvaluation', {
      title: translate('title'),
      body: translate('message', {skill: userSkill.skill.skill})
    })
  }
}

export async function unverifyUserSkill(userId: string, userSkillId: string) {
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

export async function resetVerification(userSkillId: string) {
  await db
    .delete(Schema.userSkillVerification)
    .where(eq(Schema.userSkillVerification.userSkillId, userSkillId))
    .execute()
}
