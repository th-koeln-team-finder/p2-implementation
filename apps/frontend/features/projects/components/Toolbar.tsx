'use client'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { Link } from '@/features/i18n/routing'
import {
  useIsUserAppliedToProject,
  useIsUserMemberOfProject,
} from '@/features/projects/project.hooks'
import {
  revalidateProjects,
  toggleProjectBookmark,
} from '@/features/projects/projects.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { BookmarkIcon, LinkIcon, StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOptimistic, useTransition } from 'react'

type ProjectBookmarkButtonProps = {
  projectId: string
  isBookmarked: boolean
  stars?: number
  createdById: string
}

export function Toolbar({
  stars,
  projectId,
  isBookmarked,
  createdById,
}: ProjectBookmarkButtonProps) {
  const t = useTranslations('projects')
  stars = stars || 13_000
  const starsString = stars.toLocaleString('en', { notation: 'compact' })

  const [isApplied, isLoadingApplication] = useIsUserAppliedToProject(projectId)
  const [isMember, _isLoadingMemberships] = useIsUserMemberOfProject(projectId)

  const [_, startTransition] = useTransition()
  const [optimisticBookmarked, dispatchOptimistic] = useOptimistic(
    isBookmarked,
    (_, payload: boolean) => {
      return payload
    },
  )

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row items-center gap-1">
        <Button variant="ghost" type="button">
          {starsString}
          <StarIcon />
        </Button>
        <Button variant="ghost" type="button" size="icon">
          <LinkIcon />
        </Button>
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            startTransition(() => dispatchOptimistic(!optimisticBookmarked))
            await toggleProjectBookmark(projectId, !optimisticBookmarked)
            await revalidateProjects()
          }}
        >
          <BookmarkIcon
            className={cn(optimisticBookmarked && 'fill-foreground')}
          />
        </Button>
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
