export default function ProjectTitle({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex w-full flex-col items-start justify-start">
      <h1 className="font-medium text-3xl">{title}</h1>
      <p className="font-normal text-muted-foreground text-sm">{subtitle}</p>
    </div>
  )
}
