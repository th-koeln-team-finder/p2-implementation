import { authMiddleware } from '@/auth'
import { Schema, db } from '@repo/database'
import { asc, desc, eq, sql } from 'drizzle-orm'

export const getUserSkills = async (userId: string) => {
  const session = await authMiddleware()
  const loggedInUserId = session?.user?.id

  const isVerified = loggedInUserId
    ? sql<boolean>`EXISTS (
      SELECT 1 FROM ${Schema.userSkillVerification} verifications
      WHERE verifications."userSkillId" = "userSkills"."id" AND verifications."userId" = ${loggedInUserId}
    )`
    : sql<boolean>`false`
  const verificationCount = sql<number>`(
      SELECT COUNT(*) FROM ${Schema.userSkillVerification} verifications
      WHERE verifications."userSkillId" = "userSkills"."id"
    )`.as('verificationCount')

  return db.query.userSkills.findMany({
    extras: {
      isVerified: isVerified.as('isVerified'),
      verificationCount,
    },
    where: eq(Schema.userSkills.userId, userId),
    with: {
      skill: true,
      userSkillVerification: true,
    },
    orderBy: [desc(Schema.userSkills.level), asc(Schema.userSkills.createdAt)],
  })
}
