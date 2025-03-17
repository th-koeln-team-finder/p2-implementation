'use client'

import ProjectList from '@/features/projectMemberships/components/ProjectList'
import UserProjectCreate from '@/features/projectMemberships/components/UserProjectCreate'
import { useOptimisticProjectMemberships } from '@/features/projectMemberships/projectMemberships.hooks'
import type { ProjectSelect, ProjectMembershipsSelect } from '@repo/database/schema'

export default function UserProjectsEdit({
  userProjects,
  userId,
}: {
  userProjects: (ProjectMembershipsSelect & { project?: ProjectSelect | null })[]
  userId: string
}) {
  const [projectsOptimistic, setProjectsOptimistic] =
    useOptimisticProjectMemberships(userProjects)

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
