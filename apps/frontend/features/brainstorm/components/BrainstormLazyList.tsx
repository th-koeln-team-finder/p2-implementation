'use client'
import { getBrainstormsAction } from '@/features/brainstorm/brainstorm.actions'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { Masonry } from '@repo/design-system/components/ui/Masonry'
import { Skeleton } from '@repo/design-system/components/ui/skeleton'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

type BrainstormEntry = Awaited<ReturnType<typeof getBrainstormsAction>>

export function BrainstormLazyList({
  search,
  tags,
  pageSize,
  userId,
}: {
  search: string
  tags: string
  pageSize: number
  userId?: string | undefined
}) {
  const [isLast, setIsLast] = useState(false)
  const [lazyBrainstorms, setLazyBrainstorms] = useState<BrainstormEntry>([])
  const [queryOffsetParam, setQueryOffset] = useQueryState('offset', {
    defaultValue: '0',
  })
  const queryOffset = useMemo(
    () => Number.parseInt((queryOffsetParam as string) ?? '0'),
    [queryOffsetParam],
  )
  const [loadingOffset, setLoadingOffset] = useState(queryOffset)

  const isLoading = useMemo(
    () => loadingOffset !== queryOffset,
    [loadingOffset, queryOffset],
  )

  const loadingEntries = useMemo(() => {
    return Array.from({ length: pageSize }).map((_, index) => index)
  }, [pageSize])

  const { ref, inView } = useInView()

  useEffect(() => {
    if (!inView || isLoading || isLast) {
      return
    }
    const newOffset = queryOffset + pageSize
    setLoadingOffset(newOffset)

    getBrainstormsAction(userId, search, tags, pageSize, newOffset).then(
      (res) => {
        if (!res.length) {
          setIsLast(true)
          setLoadingOffset(queryOffset)
          return
        }
        setLazyBrainstorms((prev) => [...prev, ...res])
        setQueryOffset(newOffset.toString()).catch((e) =>
          console.error('Failed to set query offset', e),
        )
      },
    )
  }, [
    inView,
    userId,
    isLoading,
    queryOffset,
    pageSize,
    setQueryOffset,
    isLast,
    tags,
    search,
  ])

  return (
    <>
      <Masonry
        masonryGutter="16px"
        columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3, 1200: 4 }}
      >
        {lazyBrainstorms.map((brainstorm) => (
          <BrainstormListEntry key={brainstorm.id} brainstorm={brainstorm} />
        ))}
        {isLoading &&
          loadingEntries.map((index) => (
            <Skeleton key={index} className="min-h-32 w-full rounded" />
          ))}
      </Masonry>
      {!isLast && <div ref={ref}>Loading...</div>}
    </>
  )
}
