import type { PopulatedBrainstorm } from '@/features/brainstorm/brainstorm.types'
import { useSession } from 'next-auth/react'
import { useOptimistic, useTransition } from 'react'

export type OptimisticPayload = {
  action: 'update'
  values: {
    id: string
    isBookmarked?: boolean
  }
}

export function useOptimisticBrainstorm(brainstorm: PopulatedBrainstorm) {
  const { data: session } = useSession()
  const [_, startTransition] = useTransition()
  const [optimisticUpdates, dispatchOptimistic] = useOptimistic(
    brainstorm,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'update': {
          const userId = session?.user?.id
          if (!userId) return state
          return {
            ...state,
            isBookmarked: payload.values.isBookmarked ?? state.isBookmarked,
          }
        }
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
