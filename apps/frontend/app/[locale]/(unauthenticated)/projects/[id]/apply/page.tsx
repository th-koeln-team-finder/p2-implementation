import ApplicationDetail from '@/features/Application/ApplicationDetails'

export default async function Application({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4">
      <ApplicationDetail projectId={id} />
    </div>
  )
}
