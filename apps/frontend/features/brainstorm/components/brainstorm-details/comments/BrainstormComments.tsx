'use client'
import type { PopulatedBrainstormComment } from '@/features/brainstorm/brainstorm.types'
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

type BrainstormCommentListProps = {
  brainstormId: string
  comments: PopulatedBrainstormComment[]
}

type OptimisticPayload =
  | {
      action: 'add'
      values: { comment: string; parentCommentId?: string }
    }
  | {
      action: 'delete'
      values: { id: string }
    }

export function BrainstormComments({
  brainstormId,
  comments,
}: BrainstormCommentListProps) {
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
            <DropdownMenuItem>
              <PinIcon />
              {translate('sortOptionPinned')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ClockIcon />
              {translate('sortOptionMostRecent')}
            </DropdownMenuItem>
            <DropdownMenuItem>
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
