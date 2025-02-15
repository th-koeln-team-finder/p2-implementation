import { ExternalLink } from '@/features/brainstorm/components/brainstorm-details/ExternalLink'
import { getPublicFileUrl } from '@/features/file-upload/file-upload.actions'
import { Link } from '@/features/i18n/routing'
import type { UploadedFileSelect } from '@repo/database/schema'
import { FileIcon } from 'lucide-react'

export async function ProjectResource({
  resource,
}: {
  resource: {
    uploadedFile: UploadedFileSelect
    href: string
    id?: string
    label: string
  }
}) {
  if (!resource.uploadedFile && !!resource.href) {
    const href = resource.href.startsWith('http')
      ? resource.href
      : `https://${resource.href}`
    return <ExternalLink href={href} label={resource.label} />
  }

  if (!resource.uploadedFile) return null
  const [, publicUrl] = await getPublicFileUrl(resource.uploadedFile.bucketPath)
  const fileEnding = resource.uploadedFile.bucketPath.split('.').pop()

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
