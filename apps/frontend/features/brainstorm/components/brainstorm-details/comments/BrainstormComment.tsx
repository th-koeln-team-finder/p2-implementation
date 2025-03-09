import { useSessionPermission } from '@/features/auth/auth.hooks'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import type { PopulatedBrainstormComment } from '@/features/brainstorm/brainstorm.types'
import {
  revalidateBrainstormComments,
  toggleCommentLike,
  toggleCommentPin,
} from '@/features/brainstorm/brainstormComment.actions'
import type { OptimisticPayload } from '@/features/brainstorm/brainstormComment.hooks'
import { RemoveBrainstormCommentButton } from '@/features/brainstorm/components/brainstorm-details/RemoveBrainstormCommentButton'
import { BrainstormCommentForm } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormCommentForm'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { HeartIcon, PinIcon, ReplyIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useState } from 'react'

type BrainstormCommentProps = {
  comment: PopulatedBrainstormComment
  setOptimistic: (payload: OptimisticPayload) => void
}

export function BrainstormComment({
  comment,
  setOptimistic,
}: BrainstormCommentProps) {
  const translate = useTranslations('brainstorm.comments')
  const [replying, setReplying] = useState(false)
  const formatter = useFormatter()
  const canLike = useSessionPermission('commentBrainstorm', 'like')
  if (!comment.creator) return null
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 rounded p-2 pr-4 sm:flex-row sm:gap-4',
        comment.isPinned && 'bg-muted/30',
      )}
    >
      <Link
        href={`/profile/${comment.creator.id}`}
        className="font-medium text-lg"
      >
        <UserAvatar user={comment.creator} />
      </Link>
      <div className="flex w-full flex-col gap-1">
        <Link
          href={`/profile/${comment.creator.id}`}
          className="font-medium text-lg hover:underline"
        >
          {comment.creator.name}
        </Link>
        <p className="text-base">{comment.comment}</p>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            {formatter.relativeTime(comment.createdAt, Date.now())}
          </p>
          <div className="flex flex-row items-center gap-4">
            <CanUserClient
              target="commentBrainstorm"
              action="reply"
              data={comment}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplying((prev) => !prev)}
              >
                <ReplyIcon />
                {translate('reply')}
              </Button>
            </CanUserClient>
            <Button
              disabled={!canLike}
              className="disabled:opacity-100"
              variant="ghost"
              size="sm"
              onClick={async () => {
                const newLiked = !comment.isLiked
                setOptimistic({
                  action: 'update',
                  values: {
                    id: comment.id,
                    isLiked: newLiked,
                    likeCount: comment.likeCount + (newLiked ? 1 : -1),
                  },
                })
                await toggleCommentLike(comment.id, newLiked)
                await revalidateBrainstormComments()
              }}
            >
              <HeartIcon
                className={cn(
                  comment.isLiked && 'fill-destructive stroke-destructive',
                )}
              />
              {formatter.number(comment.likeCount, {
                compactDisplay: 'short',
                notation: 'compact',
                maximumFractionDigits: 1,
              })}
            </Button>
            <CanUserClient
              target="commentBrainstorm"
              action="pin"
              data={comment}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  setOptimistic({
                    action: 'update',
                    values: {
                      id: comment.id,
                      isPinned: !comment.isPinned,
                    },
                  })
                  await toggleCommentPin(comment.id, !comment.isPinned)
                  await revalidateBrainstormComments()
                }}
              >
                <PinIcon
                  className={comment.isPinned ? 'fill-foreground' : 'rotate-12'}
                />
              </Button>
            </CanUserClient>
            <CanUserClient
              target="commentBrainstorm"
              action="delete"
              data={comment}
            >
              <RemoveBrainstormCommentButton
                commentId={comment.id}
                onDeleteComment={(id) =>
                  setOptimistic({ action: 'delete', values: { id } })
                }
              />
            </CanUserClient>
          </div>
        </div>
        {replying && (
          <BrainstormCommentForm
            className="mb-2"
            autoFocus
            brainstormId={comment.brainstormId}
            parentCommentId={comment.id}
            setOptimistic={(values) => {
              setReplying(false)
              setOptimistic(values)
            }}
          />
        )}
        <div>
          {comment.childComments?.map((childComment) => (
            <BrainstormComment
              key={childComment.id}
              comment={childComment}
              setOptimistic={setOptimistic}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
