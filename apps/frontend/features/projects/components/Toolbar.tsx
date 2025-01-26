'use client'

import { toggleProjectBookmark } from '@/features/projects/projects.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { BookmarkIcon, LinkIcon, StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOptimistic, useTransition } from 'react'

type ProjectBookmarkButtonProps = {
  projectId: string
  isBookmarked: boolean
}

export function Toolbar({
  stars,
  projectId,
  isBookmarked,
}: { stars?: number } & ProjectBookmarkButtonProps) {
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
    <div className="flex flex-col items-center justify-end gap-0 lg:flex-row lg:gap-4">
      <div className="flex w-full items-center justify-end gap-0 lg:w-auto ">
        <Button variant="ghost" className="p-2 hover:bg-transparent">
          <div className="my-auto leading-normal">{starsString}</div>
          <StarIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-fit w-fit p-2 hover:bg-transparent"
        >
          <LinkIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-fit w-fit p-2 hover:bg-transparent"
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            startTransition(() => dispatchOptimistic(!optimisticBookmarked))
            await toggleProjectBookmark(projectId, !optimisticBookmarked)
          }}
        >
          <BookmarkIcon
            className={cn(optimisticBookmarked && 'fill-primary')}
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
