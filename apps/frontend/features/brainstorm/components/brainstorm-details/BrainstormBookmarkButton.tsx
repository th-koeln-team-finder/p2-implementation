'use client'

import {
  revalidateBrainstorms,
  toggleBrainstormBookmark,
} from '@/features/brainstorm/brainstorm.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { BookmarkIcon } from 'lucide-react'
import { useOptimistic, useTransition } from 'react'

type BrainstormBookmarkButtonProps = {
  brainstormId: string
  isBookmarked: boolean
}

export function BrainstormBookmarkButton({
  brainstormId,
  isBookmarked,
}: BrainstormBookmarkButtonProps) {
  const [_, startTransition] = useTransition()
  const [optimisticBookmarked, dispatchOptimistic] = useOptimistic(
    isBookmarked,
    (_, payload: boolean) => {
      return payload
    },
  )
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={async () => {
        startTransition(() => dispatchOptimistic(!optimisticBookmarked))
        await toggleBrainstormBookmark(brainstormId, !optimisticBookmarked)
        await revalidateBrainstorms()
      }}
    >
      <BookmarkIcon className={cn(optimisticBookmarked && 'fill-foreground')} />
    </Button>
  )
}
