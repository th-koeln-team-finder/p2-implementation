'use client'
import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { Loader2Icon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useOptimistic, useTransition } from 'react'
import { useInView } from 'react-intersection-observer'

export function BrainstormLazyLoader({
  pageSize,
  hasMore,
  loading = false,
}: {
  pageSize: number
  hasMore?: boolean
  loading?: boolean
}) {
  const [_, startTransition] = useTransition()
  const [isLoadingReal, dispatchOptimistic] = useOptimistic(
    loading,
    (_, payload: boolean) => payload,
  )

  const [queryOffsetParam, setQueryOffset] = useQueryState('offset', {
    defaultValue: '0',
  })

  const { ref, inView } = useInView()
  // This triggers every time the user scrolls to the bottom of the page
  useEffect(() => {
    if (!inView || isLoadingReal || !hasMore) {
      return
    }
    const queryOffset = Number.parseInt((queryOffsetParam as string) ?? '0')

    startTransition(() => dispatchOptimistic(true))

    const newOffset = queryOffset + pageSize
    setQueryOffset(newOffset.toString())
      .then(() => revalidateBrainstorms())
      .catch((e) => console.error('Failed to set query offset', e))
  }, [
    dispatchOptimistic,
    inView,
    hasMore,
    isLoadingReal,
    queryOffsetParam,
    pageSize,
    setQueryOffset,
  ])

  return (
    <>
      {isLoadingReal && (
        <div className="my-4 flex justify-center">
          <Loader2Icon className="size-8 animate-spin" />
        </div>
      )}
      {hasMore && !isLoadingReal && <div ref={ref}>Loading...</div>}
    </>
  )
}
