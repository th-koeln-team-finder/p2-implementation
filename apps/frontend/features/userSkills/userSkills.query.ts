import {unstable_cache as cache} from "next/cache";
import {db, Schema} from "@repo/database";
import {asc, desc, eq} from "drizzle-orm";

export const getUserSkills = cache(
  async (userId: string) => {
    return db.query.userSkills.findMany({
      where: eq(Schema.userSkills.userId, userId),
      with: {
        skill: true,
      },
      orderBy: [desc(Schema.userSkills.level), asc(Schema.userSkills.createdAt)],
    });
  },
  ['getUserSkills'],
  {tags: ['user-skills']}
)