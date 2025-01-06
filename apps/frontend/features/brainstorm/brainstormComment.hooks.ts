import type { PopulatedBrainstormComment } from '@/features/brainstorm/brainstorm.types'
import type { UserSelect } from '@repo/database/schema'
import { useSession } from 'next-auth/react'
import { useOptimistic, useTransition } from 'react'

export type OptimisticPayload =
  | {
      action: 'add'
      values: { comment: string; parentCommentId?: string }
    }
  | {
      action: 'delete'
      values: { id: string }
    }
  | {
      action: 'update'
      values: {
        id: string
        isPinned?: boolean
        likeCount?: number
        isLiked?: boolean
      }
    }

export function useOptimisticComments(comments: PopulatedBrainstormComment[]) {
  const { data: session } = useSession()
  const [_, startTransition] = useTransition()
  const [optimisticUpdates, dispatchOptimistic] = useOptimistic(
    comments,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'add': {
          const newComment = {
            id: Math.random().toString(),
            creator: session?.user as UserSelect,
            createdById: session?.user?.id as string,
            createdAt: new Date(),
            isLiked: false,
            likeCount: 0,
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
        case 'update': {
          const userId = session?.user?.id
          if (!userId) return state
          return state.map((comment) => {
            if (comment.id === payload.values.id) {
              return {
                ...comment,
                ...payload.values,
              }
            }

            // Check if one of the childComments has the like changed
            if (
              !comment.childComments?.some(
                (childComment) => childComment.id === payload.values.id,
              )
            ) {
              return comment
            }

            return {
              ...comment,
              childComments: comment.childComments.map((childComment) => {
                if (childComment.id !== payload.values.id) {
                  return childComment
                }
                return {
                  ...childComment,
                  ...payload.values,
                }
              }),
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
  return [
    optimisticUpdates,
    (payload: OptimisticPayload) =>
      startTransition(() => dispatchOptimistic(payload)),
  ] as const
}
