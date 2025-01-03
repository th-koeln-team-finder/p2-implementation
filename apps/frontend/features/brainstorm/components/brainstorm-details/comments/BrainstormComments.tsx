'use client'
import type { PopulatedBrainstormComment } from '@/features/brainstorm/brainstorm.types'
import { BrainstormComment } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormComment'
import { BrainstormCommentForm } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormCommentForm'
import type { UserSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import { Label } from '@repo/design-system/components/ui/label'
import { ChevronDownIcon, ClockIcon, HeartIcon, PinIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useOptimistic, useTransition } from 'react'

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
  const { data: session } = useSession()
  const [_, startTransition] = useTransition()
  const [optimisticComments, setOptimistic] = useOptimistic(
    comments,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'add': {
          const newComment = {
            id: Math.random().toString(),
            creator: session?.user as UserSelect,
            createdById: session?.user?.id as string,
            createdAt: new Date(),
            ...payload.values,
          } as PopulatedBrainstormComment

          if (!payload.values.parentCommentId) {
            return [newComment, ...state]
          }

          return state.map((comment) => {
            if (comment.id !== payload.values.parentCommentId) {
              return comment
            }

            return {
              ...comment,
              childComments: [newComment, ...(comment?.childComments ?? [])],
            }
          })
        }
        case 'delete':
          return state
            .filter((comment) => comment.id !== payload.values.id)
            .map((comment) => {
              if (!comment.childComments) {
                return comment
              }
              return {
                ...comment,
                childComments: comment.childComments.filter(
                  (childComment) => childComment.id !== payload.values.id,
                ),
              }
            })
        default:
          return state
      }
    },
  )

  if (!optimisticComments.length) {
    return (
      <p className="py-4 text-center text-muted-foreground">
        {translate('empty')}
      </p>
    )
  }
  return (
    <section className="space-y-2">
      <BrainstormCommentForm
        brainstormId={brainstormId}
        onAddComment={(values) => {
          startTransition(() => setOptimistic(values))
        }}
      />
      <div className="flex flex-row items-center justify-between">
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
            onAddComment={(values) => {
              startTransition(() => setOptimistic(values))
            }}
            onDeleteComment={(id) => {
              startTransition(() =>
                setOptimistic({ action: 'delete', values: { id } }),
              )
            }}
          />
        ))}
      </div>
    </section>
  )
}
