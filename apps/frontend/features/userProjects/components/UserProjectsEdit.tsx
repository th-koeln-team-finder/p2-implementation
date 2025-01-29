"use client"

import {ProjectSelect, UserProjectsSelect} from "@repo/database/schema";
import UserProjectCreate from "@/features/userProjects/components/UserProjectCreate";
import {useOptimisticUserProjects} from "@/features/userProjects/userProjects.hooks";
import ProjectList from "@/features/userProjects/components/ProjectList";

export default function UserProjectsEdit({userProjects, userId}: {
  userProjects: (UserProjectsSelect & { project?: ProjectSelect | null })[],
  userId: string
}) {
  const [projectsOptimistic, setProjectsOptimistic] = useOptimisticUserProjects(userProjects)

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

