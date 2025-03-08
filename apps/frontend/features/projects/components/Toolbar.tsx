'use client'

import {
    joinProject,
    toggleProjectBookmark,
} from '@/features/projects/projects.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { BookmarkIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOptimistic, useTransition } from 'react'
import {CanUserClient} from "@/features/auth/components/CanUser.client";
import {authMiddleware} from "@/auth";


type ProjectBookmarkButtonProps = {
  projectId: string
  isBookmarked: boolean
}

export function Toolbar({
  projectId,
  isBookmarked
}: ProjectBookmarkButtonProps) {
  const t = useTranslations('projects')
  const [_, startTransition] = useTransition()
  const [optimisticBookmarked, dispatchOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (_, payload: boolean) => {
      return payload
    },
  )
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row items-center gap-1">

          <CanUserClient target="project" action="create">
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            startTransition(() => dispatchOptimisticBookmark(!optimisticBookmarked))
            await toggleProjectBookmark(projectId, !optimisticBookmarked)
          }}
        >
          <BookmarkIcon
            className={cn(optimisticBookmarked && 'fill-foreground')}
          />
        </Button>
          </CanUserClient>
      </div>
        <CanUserClient target="project" action="create">
      <Button
        variant="default"
        size="default"
        className="ml-2 w-full lg:w-auto"
        onClick={async () => {

            await joinProject(projectId)
        }}
      >
        {t('join')}
      </Button>
        </CanUserClient>
    </div>
  )
}

//TODO Logik der einzelnen Buttons hinzufügen (Teilen, Merken etc.)
