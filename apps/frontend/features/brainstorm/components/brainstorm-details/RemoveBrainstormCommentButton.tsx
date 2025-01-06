'use client'

import {
  removeBrainstormComment,
  revalidateBrainstormComments,
} from '@/features/brainstorm/brainstormComment.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { TrashIcon } from 'lucide-react'

type RemoveBrainstormCommentButtonProps = {
  commentId: string
  onDeleteComment: (id: string) => void
}

export function RemoveBrainstormCommentButton({
  commentId,
  onDeleteComment,
}: RemoveBrainstormCommentButtonProps) {
  return (
    <Button
      variant="ghostDestructive"
      size="icon"
      onClick={async () => {
        onDeleteComment(commentId)
        await removeBrainstormComment(commentId)
        await revalidateBrainstormComments()
      }}
    >
      <TrashIcon />
    </Button>
  )
}
