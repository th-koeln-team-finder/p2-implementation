import {db, Schema} from '@repo/database'
import {authMiddleware} from "@/auth";
import {asc, desc, eq, sql} from "drizzle-orm";

export const getUserSkills = async (userId: string) => {
  const session = await authMiddleware()
  const loggedInUserId = session?.user?.id

  /*const userSkills = await db.query.userSkills.findMany({
    where: eq(Schema.userSkills.userId, userId),
    with: {
      skill: true,
      userSkillVerification: {
        columns: {},
        extras: {
          isVerified: eq(userSkillVerification.verifierId, loggedInUserId)
        }
      },
    },
    orderBy: [
      desc(Schema.userSkills.level),
      asc(Schema.userSkills.createdAt),
    ],
  })*/
  const userSkills = await db.select({
    id: Schema.userSkills.id,
    userId: Schema.userSkills.userId,
    skillId: Schema.userSkills.skillId,
    level: Schema.userSkills.level,
    createdAt: Schema.userSkills.createdAt,
    skill: Schema.skills.skill,
    isVerified: sql<boolean>`EXISTS (
      SELECT 1 FROM ${Schema.userSkillVerification} 
      WHERE ${eq(Schema.userSkillVerification.userSkillId, Schema.userSkills.id)} 
      AND ${eq(Schema.userSkillVerification.verifierId, loggedInUserId ?? '')}
    )`.as('isVerified'),
    verificationCount: sql<number>`(
      SELECT COUNT(*) FROM ${Schema.userSkillVerification}
      WHERE ${eq(Schema.userSkillVerification.userSkillId, Schema.userSkills.id)}
    )`.as('verificationCount')
  })
    .from(Schema.userSkills)
    .leftJoin(Schema.skills, eq(Schema.skills.id, Schema.userSkills.skillId))
    .where(eq(Schema.userSkills.userId, userId))
    .orderBy(
      desc(Schema.userSkills.level),
      asc(Schema.userSkills.createdAt)
    );

  return userSkills;
}
