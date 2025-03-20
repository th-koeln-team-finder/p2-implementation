'use client'
import { useSessionPermission } from '@/features/auth/auth.hooks'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { Link } from '@/features/i18n/routing'
import {
  useIsUserAppliedToProject,
  useIsUserMemberOfProject,
} from '@/features/projects/project.hooks'
import {
  toggleProjectBookmark,
  toggleProjectStar,
} from '@/features/projects/projects.actions'
import type { PopulatedProject } from '@/features/projects/projects.types'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { BookmarkIcon, StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOptimistic, useTransition } from 'react'

type ProjectProps = {
  project: PopulatedProject
}

export function Toolbar({ project }: ProjectProps) {
  const t = useTranslations('projects')
  const stars = project.starCount || 13_000
  const projectId = project.id
  const starsString = stars.toLocaleString('en', { notation: 'compact' })
  const createdById = project.createdBy

  const [isApplied, isLoadingApplication] = useIsUserAppliedToProject(projectId)
  const [isMember, _isLoadingMemberships] = useIsUserMemberOfProject(projectId)

  const [_, startTransition] = useTransition()
  const canCreate = useSessionPermission('project', 'create')
  const [optimisticBookmarked, dispatchOptimisticBookmark] = useOptimistic(
    project.isBookmarked,
    (_, payload: boolean) => {
      return payload
    },
  )
  const [optimisticStared, dispatchOptimisticStar] = useOptimistic(
    project.isStared,
    (_, payload: boolean) => {
      return payload
    },
  )
  return (
    <div className="ml-auto flex flex-col items-end gap-2 md:ml-0 md:flex-row md:items-center">
      <div className="flex flex-row items-center gap-1">
        <Button
          variant="ghost"
          type="button"
          disabled={!canCreate}
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            startTransition(() => dispatchOptimisticStar(!optimisticStared))
            await toggleProjectStar(project.id, !optimisticStared)
          }}
        >
          {starsString}
          <StarIcon className={cn(optimisticStared && 'fill-foreground')} />
        </Button>
        <CanUserClient target="project" action="create">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            onClick={async (e) => {
              e.stopPropagation()
              e.preventDefault()
              startTransition(() =>
                dispatchOptimisticBookmark(!optimisticBookmarked),
              )
              await toggleProjectBookmark(project.id, !optimisticBookmarked)
            }}
          >
            <BookmarkIcon
              className={cn(optimisticBookmarked && 'fill-foreground')}
            />
          </Button>
        </CanUserClient>
      </div>
      {!isMember && (
        <CanUserClient
          target="applyProject"
          action="create"
          data={{ createdById }}
        >
          <Link href={`/projects/${projectId}/apply`}>
            <Button
              disabled={isLoadingApplication || isApplied}
              variant="default"
              size="default"
              className="ml-2 w-full lg:w-auto"
            >
              {t('join')}
            </Button>
          </Link>
        </CanUserClient>
      )}
      <CanUserClient
        target="projectApplication"
        action="view"
        data={{ createdById }}
      >
        <Link href={`/projects/${projectId}/overview`}>
          <Button
            variant="default"
            size="default"
            className="ml-2 w-full lg:w-auto"
          >
            {t('goToOverview')}
          </Button>
        </Link>
      </CanUserClient>
    </div>
  )
}

//TODO Logik der einzelnen Buttons hinzufügen (Teilen, Merken etc.)
