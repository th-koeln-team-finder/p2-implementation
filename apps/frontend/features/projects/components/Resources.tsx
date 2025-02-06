import { ExternalLink } from '@/features/brainstorm/components/brainstorm-details/ExternalLink'
import { useTranslations } from 'next-intl'

export function Resources({
  resources,
}: { resources: { href: string; id?: string; label: string }[] }) {
  const translations = useTranslations('projects')

  const linkElements = resources.map((resources) => {
    return (
      <ExternalLink
        href={`https://${resources.href}`}
        key={resources.id ? resources.id : resources.href}
        label={resources.label}
        className="!text-muted-foreground hover:!text-primary"
      />
    )
  })

  return (
    <>
      <h3 className="mb-2 font-medium text-2xl">{translations('links')}</h3>
      {<div className="flex flex-col gap-2">{linkElements}</div>}
    </>
  )
}
