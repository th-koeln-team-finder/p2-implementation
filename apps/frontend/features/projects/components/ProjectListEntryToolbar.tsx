'use client'

import { Button } from '@repo/design-system/components/ui/button'
import { BookmarkIcon, StarIcon } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import {
  type MouseEventHandler,
  useCallback,
  useOptimistic,
  useTransition,
} from 'react'
import {
  revalidateProjects,
  toggleProjectBookmark,
  toggleProjectStar,
} from '@/features/projects/projects.actions'

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
  return (
    <div className="flex flex-row items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleStar}>
        {optimisticStarCount}
        <StarIcon className={cn(optimisticStared && 'fill-foreground')} />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleBookmark}>
        <BookmarkIcon
          className={cn(optimisticBookmarked && 'fill-foreground')}
        />
      </Button>
    </div>
  )
}
