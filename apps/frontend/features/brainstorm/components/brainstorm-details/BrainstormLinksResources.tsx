import type { PopulatedBrainstormResource } from '@/features/brainstorm/brainstorm.types'
import { ExternalLink } from '@/features/brainstorm/components/brainstorm-details/ExternalLink'
import { getPublicFileUrl } from '@/features/file-upload/file-upload.actions'
import { Link } from '@/features/i18n/routing'
import { FileIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type BrainstormLinksResourcesProps = {
  links: PopulatedBrainstormResource[]
}

export async function BrainstormLinksResources({
  links,
}: BrainstormLinksResourcesProps) {
  const publicFileUrls = await Promise.all(
    links
      .filter((link) => link.type === 'file')
      .map(async (file) => [
        file.id,
        file.file && (await getPublicFileUrl(file.file.bucketPath)),
      ]),
  )
  const translate = await getTranslations('brainstorm')
  if (!links.length) {
    return (
      <p className="text-muted-foreground text-sm italic">
        {translate('emptyResources')}
      </p>
    )
  }
  return (
    <ul>
      {links.map((link) => {
        const publicLinks = publicFileUrls.find(([id]) => id === link.id)
        if (link.type === 'file' && !publicLinks) return null
        return (
          <li key={link.id}>
            <BrainstormLinksResource resource={link} />
          </li>
        )
      })}
    </ul>
  )
}

type BrainstormLinksResourceProps = {
  resource: PopulatedBrainstormResource
}

async function BrainstormLinksResource({
  resource,
}: BrainstormLinksResourceProps) {
  if (resource.type === 'link') {
    return (
      <ExternalLink href={resource.value as string} label={resource.label} />
    )
  }
  if (!resource.file) return null
  const [, publicUrl] = await getPublicFileUrl(resource.file.bucketPath)
  const fileEnding = resource.file.bucketPath.split('.').pop()

  return (
    <div className="flex flex-row items-end gap-2">
      <Link
        href={publicUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex flex-row items-center gap-1 text-primary underline underline-offset-2"
      >
        <FileIcon className="size-4" />
        {resource.label}
      </Link>
      {fileEnding && (
        <span className="pb-0.5 text-muted-foreground text-xs">
          ({fileEnding.toUpperCase()})
        </span>
      )}
    </div>
  )
}
