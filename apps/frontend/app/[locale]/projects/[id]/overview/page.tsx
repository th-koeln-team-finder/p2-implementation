import ApplicationOverview from '@/features/Application/components/ApplicationOverview'

export default async function Overview({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4">
      <ApplicationOverview projectId={id} />
    </div>
  )
}
