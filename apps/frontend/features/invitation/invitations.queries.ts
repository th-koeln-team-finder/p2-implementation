import { Schema, db } from '@repo/database'
import { and, desc, eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getInvitationsForUser = cache(
  async (id: string) =>
    await db.query.userInvitations.findMany({
      where: and(eq(Schema.userInvitations.userId, id)),
      with: {
        project: true,
        user: {
          with: {
            image: true,
          },
        },
      },
      orderBy: [desc(Schema.userInvitations.createdAt)],
    }),
  ['getInvitationsForUser'],
  { tags: ['invitations'] },
)

export async function getInvitation(id: string) {
  return await db.query.userInvitations.findFirst({
    where: eq(Schema.userInvitations.id, id),
    with: {
      project: true,
      user: {
        with: {
          image: true,
        },
      },
    },
  })
}
