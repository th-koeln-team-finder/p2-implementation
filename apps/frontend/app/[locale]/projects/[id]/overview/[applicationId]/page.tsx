export default async function Overview({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>
}) {
  const { id, applicationId } = await params

  return (
    <div className="container mx-auto px-4">
      testing {id}, {applicationId}
    </div>
  )
}
