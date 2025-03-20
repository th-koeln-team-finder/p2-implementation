import { authMiddleware } from '@/auth'
import { LazyLoader } from '@/features/general/components/LazyLoader'
import { FindSomeoneListEntry } from '@/features/projects/components/FindUserEntry'
import { revalidateUser } from '@/features/users/users.actions'
import { getUsers } from '@/features/users/users.query'

type FindSomeoneListProps = {
  search?: string
  offset?: string
  projectId: string
}

const pageSize = 15

export async function FindSomeoneList({
  projectId,
  offset,
}: FindSomeoneListProps) {
  const session = await authMiddleware()

  const offsetNumber = Number.parseInt(offset ?? '0')
  const limit = pageSize + offsetNumber

  const users = await getUsers(projectId, limit, session?.user?.id)
  const hasMore = limit <= users.length

  return (
    <div className="container mx-auto my-4 max-w-screen-xl px-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {users.map((user) => (
          <FindSomeoneListEntry
            key={user.id}
            user={user}
            projectId={projectId}
          />
        ))}
      </div>
      <LazyLoader
        hasMore={hasMore}
        pageSize={pageSize}
        onInvalidate={revalidateUser}
      />
    </div>
  )
}
