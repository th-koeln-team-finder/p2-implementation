'use client'

import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { loadMoreProjects } from '@/features/users/users.actions'
import type { ProjectSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PreviouslyWorkedOn({
  loadMoreProjectsText,
}: { loadMoreProjectsText: string }) {
  const [previouslyWorkedOn, setPreviouslyWorkedOn] = useState<ProjectSelect[]>(
    [],
  )

  function loadMore(count = 10) {
    loadMoreProjects(count, previouslyWorkedOn.length).then(
      (projects: ProjectSelect[]) => {
        setPreviouslyWorkedOn([...previouslyWorkedOn, ...projects])
      },
    )
  }
  useEffect(() => {
    loadMore(3)
  }, [])

  return (
    <div className="text-center">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {previouslyWorkedOn.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <Button variant="link" className="my-2" onClick={() => loadMore()}>
        {' '}
        <ChevronDown />
        {loadMoreProjectsText}
      </Button>
    </div>
  )
}
