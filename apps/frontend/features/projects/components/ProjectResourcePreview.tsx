'use client'
import { ExternalLink } from '@/features/brainstorm/components/brainstorm-details/ExternalLink'
import { Link } from '@/features/i18n/routing'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { FileIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ProjectResourcePreview({
  resource,
}: { resource: CreateProjectFormValues['resources'][number] }) {
  const [fileUrl, setFileUrl] = useState('')

  if (!resource.isDocument) {
    const href = resource.href.startsWith('http')
      ? resource.href
      : `https://${resource.href}`
    return <ExternalLink href={href} label={resource.label} />
  }

  useEffect(() => {
    if (!resource.file[0]) {
      setFileUrl('')
      return
    }
    const newFileUrl = window.URL.createObjectURL(resource.file[0])
    setFileUrl(newFileUrl)
    return () => {
      window.URL.revokeObjectURL(newFileUrl)
    }
  }, [resource.file])

  if (!fileUrl) return null

  const fileEnding = resource.file[0].name.split('.').pop()

  return (
    <div className="flex flex-row items-end gap-2">
      <Link
        href={fileUrl}
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
