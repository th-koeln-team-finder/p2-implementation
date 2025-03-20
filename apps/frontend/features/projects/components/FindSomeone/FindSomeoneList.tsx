import { FindSomeoneListEntry } from '@/features/projects/components/FindUserEntry'
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
  search,
}: FindSomeoneListProps) {
  const users = await getUsers(projectId)

  if (!users.length) return null
  return (
    <div className="container mx-auto my-4 max-w-screen-xl px-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id}>
            <FindSomeoneListEntry user={user} projectId={projectId} />
          </div>
        ))}
      </div>
    </div>
  )
}
