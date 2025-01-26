export default function ProjectTitle({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="inline-flex flex-col items-start justify-start">
      <h1 className="font-medium text-3xl">{title}</h1>
      <h2 className="font-normal text-sm">{subtitle}</h2>
    </div>
  )
}
