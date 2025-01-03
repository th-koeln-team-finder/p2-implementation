'use client'
import { useSessionPermission } from '@/features/auth/auth.hooks'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import type { PopulatedBrainstormComment } from '@/features/brainstorm/brainstorm.types'
import { RemoveBrainstormCommentButton } from '@/features/brainstorm/components/brainstorm-details/RemoveBrainstormCommentButton'
import { BrainstormCommentForm } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormCommentForm'
import { Button } from '@repo/design-system/components/ui/button'
import { HeartIcon, PinIcon, ReplyIcon } from 'lucide-react'
import { useFormatter } from 'next-intl'
import { useState } from 'react'

type BrainstormCommentProps = {
  comment: PopulatedBrainstormComment
  onAddComment: (action: {
    action: 'add'
    values: { comment: string; parentCommentId?: string }
  }) => void
  onDeleteComment: (id: string) => void
}

export function BrainstormComment({
  comment,
  onAddComment,
  onDeleteComment,
}: BrainstormCommentProps) {
  const [replying, setReplying] = useState(false)
  const formatter = useFormatter()
  const canLike = useSessionPermission('commentBrainstorm', 'like')
  return (
    <div className="flex w-full flex-row gap-4">
      <UserAvatar user={comment.creator} />
      <div className="flex w-full flex-col gap-1">
        <p className="font-medium text-lg">{comment.creator?.name}</p>
        <p className="text-base">{comment.comment}</p>
        <div className="flex flex-row items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {formatter.relativeTime(comment.createdAt, Date.now())}
          </p>
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
              Reply
            </Button>
          </CanUserClient>
          <Button
            disabled={!canLike}
            className="disabled:opacity-100"
            variant="ghost"
            size="sm"
          >
            <HeartIcon className={'fill-destructive stroke-destructive'} />
            21k
          </Button>
          <CanUserClient
            target="commentBrainstorm"
            action="pin"
            data={comment.brainstorm}
          >
            <Button variant="ghost" size="icon">
              <PinIcon />
            </Button>
          </CanUserClient>
          <CanUserClient
            target="commentBrainstorm"
            action="delete"
            data={comment}
          >
            <RemoveBrainstormCommentButton
              commentId={comment.id}
              onDeleteComment={onDeleteComment}
            />
          </CanUserClient>
        </div>
        {replying && (
          <BrainstormCommentForm
            className="mb-2"
            brainstormId={comment.brainstormId}
            parentCommentId={comment.id}
            onAddComment={(values) => {
              onAddComment(values)
              setReplying(false)
            }}
          />
        )}
        <div>
          {comment.childComments
            ?.toSorted(
              (a, b) =>
                (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
            )
            ?.map((childComment) => (
              <BrainstormComment
                key={childComment.id}
                comment={childComment}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
