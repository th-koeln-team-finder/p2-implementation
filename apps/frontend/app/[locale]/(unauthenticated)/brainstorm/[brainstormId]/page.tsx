import { BrainstormDetails } from '@/features/brainstorm/components/brainstorm-details/BrainstormDetails'

export default async function BrainstormDetailPage({
  params,
}: { params: Promise<{ brainstormId: string }> }) {
  const { brainstormId } = await params
  return (
    <div className="mx-auto max-w-4xl">
      <BrainstormDetails brainstormId={brainstormId} />
    </div>
  )
}
