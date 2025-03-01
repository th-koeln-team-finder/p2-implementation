import { Masonry } from '@repo/design-system/components/ui/Masonry'
import { Skeleton } from '@repo/design-system/components/ui/skeleton'

export function BrainstormListLoading() {
  return (
    <section>
      <Masonry
        masonryGutter="16px"
        columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3, 1400: 4 }}
      >
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-32 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-96 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
        <Skeleton className="min-h-48 w-full rounded" />
      </Masonry>
    </section>
  )
}
