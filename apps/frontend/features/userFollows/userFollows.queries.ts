import { db } from '@repo/database'
import { userFollows } from '@repo/database/schema'
import { and, eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/dist/server/web/spec-extension/unstable-cache'

export const userFollowsUser = cache(
  (followerId: string, followeeId: string) => {
    return db.query.userFollows.findFirst({
      where: and(
        eq(userFollows.followeeId, followeeId),
        eq(userFollows.followerId, followerId),
      ),
    })
  },
  ['userFollowsUser'],
  { tags: ['userFollows'] },
)
