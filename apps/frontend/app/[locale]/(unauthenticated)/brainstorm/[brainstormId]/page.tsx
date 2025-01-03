import { BrainstormDetails } from '@/features/brainstorm/components/brainstorm-details/BrainstormDetails'
import { BrainstormDetailsLoading } from '@/features/brainstorm/components/loading/BrainstormDetailsLoading'
import { Suspense } from 'react'

export default async function BrainstormDetailPage({
  params,
}: { params: Promise<{ brainstormId: string }> }) {
  const { brainstormId } = await params
  return (
    <div className="mx-auto max-w-4xl">
      <Suspense fallback={<BrainstormDetailsLoading />}>
        <BrainstormDetails brainstormId={brainstormId} />
      </Suspense>
    </div>
  )
}
