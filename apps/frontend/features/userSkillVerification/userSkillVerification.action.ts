'use server'

import { getPathname } from '@/features/i18n/routing'
import { sendNotificationByType } from '@/features/notifications/notifications.actions'
import { Schema, db } from '@repo/database'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'

export async function verifyUserSkill(userId: string, userSkillId: string) {
  await db.insert(Schema.userSkillVerification).values({
    verifierId: userId,
    userSkillId,
  })

  const userSkill = await db.query.userSkills.findFirst({
    where: eq(Schema.userSkills.id, userSkillId),
    with: {
      skill: true,
      user: true,
    },
  })

  if (userSkill) {
    await sendNotificationByType([userSkill.userId], 'newSkillEvaluation', {
      title: ['notifications.newSkillEvaluation.title'],
      body: [
        'notifications.newSkillEvaluation.message',
        { skill: userSkill.skill.skill },
      ],
      data: {
        link: getPathname({ href: '/profile', locale: await getLocale() }),
        linkText: ['notifications.newSkillEvaluation.linkText'],
      },
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
