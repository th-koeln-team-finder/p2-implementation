export default function ProjectTitle({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex-col justify-start items-start inline-flex">
      <h1 className="text-3xl font-medium">{title}</h1>
      <h2 className="text-sm font-normal">{subtitle}</h2>
    </div>
  )
}
