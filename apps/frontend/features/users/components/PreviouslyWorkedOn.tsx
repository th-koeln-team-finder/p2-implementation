'use client'

import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { loadMoreProjects } from '@/features/users/users.actions'
import type { ProjectMembershipsSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import { ChevronDown, LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

export default function PreviouslyWorkedOn({ userId }: { userId: string }) {
  const [previouslyWorkedOn, setPreviouslyWorkedOn] = useState<
    ProjectMembershipsSelect[]
  >([])
  const [loading, setLoading] = useState(false)
  const [allLoaded, setAllLoaded] = useState(false)
  const translate = useTranslations('users')

  // biome-ignore lint/correctness/useExhaustiveDependencies: setting all variables in here causes infinite loading issues since `loading` and `previouslyWorkedOn` are set by this function and thereby would re-trigger it
  const loadMore = useCallback(
    (count = 10, previouslyWorkedOn: ProjectMembershipsSelect[] = []) => {
      if (loading) return
      setLoading(true)
      loadMoreProjects(userId, count, previouslyWorkedOn.length).then(
        (projects: ProjectMembershipsSelect[]) => {
          setLoading(false)
          setPreviouslyWorkedOn([...previouslyWorkedOn, ...projects])
          if (projects.length < count) {
            setAllLoaded(true)
          }
        },
      )
    },
    [userId],
  )

  useEffect(() => {
    loadMore(3)
  }, [loadMore])

  return (
    <div>
      <div className="text-center">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {previouslyWorkedOn.map((project) => (
            <ProjectCard
              key={project.projectName}
              project={{
                id: project.projectId || '',
                name: project.projectName || '',
                description: project.projectDescription || '',
              }}
            />
          ))}
        </div>
        {loading ? (
          <LoaderCircle className="mx-auto animate-spin" />
        ) : (
          !allLoaded && (
            <Button
              variant="link"
              className="my-2"
              onClick={() => loadMore(10, previouslyWorkedOn)}
            >
              {' '}
              <ChevronDown />
              {translate('loadMoreProjects')}
            </Button>
          )
        )}
      </div>
      {previouslyWorkedOn.length === 0 && !loading && (
        <p className="text-muted-foreground text-sm italic">
          {translate('noProjectsFound')}
        </p>
      )}
    </div>
  )
}
