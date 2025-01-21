import { getPublicFileUrl } from '@/features/file-upload/file-upload.actions'
import type { UploadedFileSelect } from '@repo/database/schema'
import Image from 'next/image'
import { Fragment } from 'react'

type FilePreviewProps = {
  className?: string
  file: UploadedFileSelect
  width?: number
  height?: number
}

export async function FilePreview({
  file,
  className,
  width,
  height,
}: FilePreviewProps) {
  const [serverUrl, publicUrl] = await getPublicFileUrl(file.bucketPath)
  console.log('serverUrl', serverUrl)
  console.log('publicUrl', publicUrl)
  throw new Error('TEST')
  if (file.fileType.startsWith('image')) {
    return (
      <Fragment>
        <Image
          src={serverUrl}
          alt="file preview"
          className={className}
          width={width}
          height={height}
        />
      </Fragment>
    )
  }
  if (file.fileType === 'application/pdf') {
    return (
      <iframe
        src={publicUrl}
        className={className}
        title="file preview"
        width={width}
        height={height}
      />
    )
  }

  return (
    <a href={publicUrl} target="_blank" rel="noreferrer" className={className}>
      {file.bucketPath}
    </a>
  )
}
