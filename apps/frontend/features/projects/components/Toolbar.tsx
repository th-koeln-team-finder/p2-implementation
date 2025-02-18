'use client'

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
}

export function Toolbar({
  stars,
  projectId,
  isBookmarked,
}: ProjectBookmarkButtonProps) {
  const t = useTranslations('projects')
  stars = stars || 13_000
  const starsString = stars.toLocaleString('en', { notation: 'compact' })

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
      <Button
        variant="default"
        size="default"
        className="ml-2 w-full lg:w-auto"
      >
        {t('join')}
      </Button>
    </div>
  )
}

//TODO Logik der einzelnen Buttons hinzufügen (Teilen, Merken etc.)
