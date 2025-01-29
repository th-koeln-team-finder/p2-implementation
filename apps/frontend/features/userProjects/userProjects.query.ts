import {unstable_cache as cache} from "next/cache";
import {db, Schema} from "@repo/database";
import {asc, desc, eq} from "drizzle-orm";

export const getUserProjects = cache(
  async (userId: string) => {
    return db.query.userProjects.findMany({
      where: eq(Schema.userProjects.userId, userId),
      with: {
        project: true,
      },
      orderBy: [asc(Schema.userProjects.projectJoinedDate)],
    });
  },
  ['getUserProjects'],
  {tags: ['user-projects']}
)