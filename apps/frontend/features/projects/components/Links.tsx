import { Button } from '@repo/design-system/components/ui/button'
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Links({
  links,
}: { links: { label: string; href: string; isDocument?: boolean }[] }) {
  const t = useTranslations('projects')
  const linkElements: JSX.Element[] = []
  links.map((link) => {
    linkElements.push(
      <Button
        variant="link"
        className="h-fit justify-start p-0 font-normal text-base text-foreground"
      >
        {link.isDocument ? <DownloadIcon /> : <ExternalLinkIcon />}
        {link.label ? link.label : link.href}
      </Button>,
    )
  })
  return (
    <>
      <h3 className="mb-2 font-medium text-2xl">{t('links')}</h3>
      <div className="flex flex-col gap-2">{linkElements}</div>
    </>
  )
}
