'use client'

import ProjectList from '@/features/userProjects/components/ProjectList'
import UserProjectCreate from '@/features/userProjects/components/UserProjectCreate'
import { useOptimisticUserProjects } from '@/features/userProjects/userProjects.hooks'
import type { ProjectSelect, UserProjectsSelect } from '@repo/database/schema'

export default function UserProjectsEdit({
  userProjects,
  userId,
}: {
  userProjects: (UserProjectsSelect & { project?: ProjectSelect | null })[]
  userId: string
}) {
  const [projectsOptimistic, setProjectsOptimistic] =
    useOptimisticUserProjects(userProjects)

  return (
    <div className="space-y-4">
      <ProjectList
        userProjects={projectsOptimistic}
        setProjectsOptimistic={setProjectsOptimistic}
      />
      <hr />
      <UserProjectCreate
        userId={userId}
        setProjectsOptimistic={setProjectsOptimistic}
      />
    </div>
  )
}
