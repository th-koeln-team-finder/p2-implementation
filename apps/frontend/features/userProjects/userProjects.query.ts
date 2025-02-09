import {unstable_cache as cache} from "next/cache";
import {db, Schema} from "@repo/database";
import {asc, eq} from "drizzle-orm";

export const getUserProjects = cache(
  async (userId: string, limit?: number, offset?: number) => {
    return await db.query.userProjects.findMany({
      where: eq(Schema.userProjects.userId, userId),
      with: {
        project: true,
      },
      limit,
      offset,
      orderBy: [asc(Schema.userProjects.projectJoinedDate)],
    });
  },
  ['getUserProjects'],
  {tags: ['user-projects']}
)