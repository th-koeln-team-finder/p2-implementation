import { Button } from '@repo/design-system/components/ui/button'
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function Links({
  links,
}: { links: { label: string; href: string; isDocument?: boolean }[] }) {
  const t = await getTranslations('projects')
  const linkElements: JSX.Element[] = []
  links.forEach((link) => {
    linkElements.push(
      <Button variant="link" className="justify-start text-underline">
        {link.isDocument ? <DownloadIcon /> : <ExternalLinkIcon />}
        {link.label}
      </Button>,
    )
  })
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl font-medium leading-loose">{t('links')}</h3>

      {linkElements}
    </div>
  )
}
