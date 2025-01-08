import { BrainstormDetails } from '@/features/brainstorm/components/brainstorm-details/BrainstormDetails'
import { BrainstormDetailsLoading } from '@/features/brainstorm/components/loading/BrainstormDetailsLoading'
import { Suspense } from 'react'

export default async function BrainstormDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ brainstormId: string }>
  searchParams: Promise<{ sort: string }>
}) {
  const { brainstormId } = await params
  const { sort } = await searchParams
  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<BrainstormDetailsLoading />}>
        <BrainstormDetails brainstormId={brainstormId} sort={sort} />
      </Suspense>
    </div>
  )
}
