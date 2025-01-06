'use client'
import type { PopulatedBrainstormComment } from '@/features/brainstorm/brainstorm.types'
import { revalidateBrainstormComments } from '@/features/brainstorm/brainstormComment.actions'
import { useOptimisticComments } from '@/features/brainstorm/brainstormComment.hooks'
import { BrainstormComment } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormComment'
import { BrainstormCommentForm } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormCommentForm'
import { Button } from '@repo/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import { Label } from '@repo/design-system/components/ui/label'
import { ChevronDownIcon, ClockIcon, HeartIcon, PinIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'

type BrainstormCommentListProps = {
  brainstormId: string
  comments: PopulatedBrainstormComment[]
}

export function BrainstormComments({
  brainstormId,
  comments,
}: BrainstormCommentListProps) {
  const [, setSort] = useQueryState('sort')
  const translate = useTranslations('brainstorm.comments')
  const [optimisticComments, setOptimistic] = useOptimisticComments(comments)

  if (!optimisticComments.length) {
    return (
      <div>
        <BrainstormCommentForm
          brainstormId={brainstormId}
          setOptimistic={setOptimistic}
        />
        <p className="mt-2 py-4 text-center text-muted-foreground">
          {translate('empty')}
        </p>
      </div>
    )
  }
  return (
    <section className="space-y-2">
      <BrainstormCommentForm
        brainstormId={brainstormId}
        setOptimistic={setOptimistic}
      />
      <div className="mt-4 flex flex-row items-center justify-between">
        <Label>{translate('heading')}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {translate('sortButtonLabel')}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={async () => {
                await setSort('pinned')
                await revalidateBrainstormComments()
              }}
            >
              <PinIcon />
              {translate('sortOptionPinned')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await setSort('newest')
                await revalidateBrainstormComments()
              }}
            >
              <ClockIcon />
              {translate('sortOptionMostRecent')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await setSort('liked')
                await revalidateBrainstormComments()
              }}
            >
              <HeartIcon />
              {translate('sortOptionMostPopular')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-4">
        {optimisticComments.map((comment) => (
          <BrainstormComment
            key={comment.id}
            comment={comment}
            setOptimistic={setOptimistic}
          />
        ))}
      </div>
    </section>
  )
}
