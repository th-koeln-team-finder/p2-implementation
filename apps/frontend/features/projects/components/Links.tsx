import { ExternalLink } from '@/features/brainstorm/components/brainstorm-details/ExternalLink'
import { Button } from '@repo/design-system/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {ProjectLinksSelect} from "@repo/database/schema";

export function Links({
  links,
}: { links: ProjectLinksSelect[] }) {
  const t = useTranslations('projects')
  /**
  const linkElements: JSX.Element[] = []
  links.map((link) => {

    if (link.isDocument) {
      linkElements.push(
        <Button
          variant="link"
          className="h-fit justify-start p-0 font-normal text-base text-foreground"
        >
          <DownloadIcon />
        </Button>,
      )
    } else {

      linkElements.push(
        <ExternalLink
          href={link.href}
          label={link.label ? link.label : link.href}
          className="!text-muted-foreground hover:!text-primary"
        />,
      )
    }
  })
        **/
  return (
    <>
      <h3 className="mb-2 font-medium text-2xl">{t('links')}</h3>
      <div className="flex flex-col gap-2">{links}</div>
    </>
  )
}
