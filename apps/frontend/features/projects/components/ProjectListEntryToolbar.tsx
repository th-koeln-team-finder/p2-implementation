'use client'

import { useSessionPermission } from '@/features/auth/auth.hooks'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import {
  revalidateProjects,
  toggleProjectBookmark,
  toggleProjectStar,
} from '@/features/projects/projects.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { BookmarkIcon, StarIcon } from 'lucide-react'
import {
  type MouseEventHandler,
  useCallback,
  useOptimistic,
  useTransition,
} from 'react'

type FindAProjectListEntryProps = {
  projectId: string
  isBookmarked: boolean
  isStared: boolean
  projectStars: string
}

export function ProjectListEntryToolbar({
  projectId,
  isBookmarked,
  isStared,
  projectStars,
}: FindAProjectListEntryProps) {
  const [_, startTransition] = useTransition()
  const [optimisticBookmarked, dispatchOptimisticBookmarked] = useOptimistic(
    isBookmarked,
    (_, payload: boolean) => {
      return payload
    },
  )
  const [optimisticStared, dispatchOptimisticStared] = useOptimistic(
    isStared,
    (_, payload: boolean) => {
      return payload
    },
  )
  const [optimisticStarCount, dispatchOptimisticStarCount] = useOptimistic(
    +projectStars,
    (_, payload: number) => {
      return payload
    },
  )

  const handleBookmark = useCallback(
    async (e: Parameters<MouseEventHandler>[0]) => {
      e.preventDefault()
      e.stopPropagation()

      startTransition(() => dispatchOptimisticBookmarked(!optimisticBookmarked))
      await toggleProjectBookmark(projectId, !optimisticBookmarked)
      await revalidateProjects()
    },
    [projectId, optimisticBookmarked, dispatchOptimisticBookmarked],
  )

  const handleStar = useCallback(
    async (e: Parameters<MouseEventHandler>[0]) => {
      e.preventDefault()
      e.stopPropagation()

      startTransition(() => dispatchOptimisticStared(!optimisticStared))
      startTransition(() =>
        dispatchOptimisticStarCount(
          optimisticStarCount + (optimisticStared ? -1 : 1),
        ),
      )
      await toggleProjectStar(projectId, !optimisticStared)
      await revalidateProjects()
    },
    [
      projectId,
      optimisticStared,
      dispatchOptimisticStared,
      optimisticStarCount,
      dispatchOptimisticStarCount,
    ],
  )

  const canLikeProject = useSessionPermission('project', 'like')

  return (
    <div className="flex flex-row items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={canLikeProject ? handleStar : undefined}
        disabled={!canLikeProject}
      >
        {optimisticStarCount}
        <StarIcon className={cn(optimisticStared && 'fill-foreground')} />
      </Button>
      <CanUserClient target="project" action="bookmark">
        <Button variant="ghost" size="icon" onClick={handleBookmark}>
          <BookmarkIcon
            className={cn(optimisticBookmarked && 'fill-foreground')}
          />
        </Button>
      </CanUserClient>
    </div>
  )
}
