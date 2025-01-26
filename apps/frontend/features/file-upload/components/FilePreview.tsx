import { getPublicFileUrl } from '@/features/file-upload/file-upload.actions'
import type { UploadedFileSelect } from '@repo/database/schema'
import Image from 'next/image'

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
  if (file.fileType.startsWith('image')) {
    // Since the Next Image is fetching the actual image via the server, we cannot use the public url
    return (
      <Image
        src={serverUrl}
        alt="file preview"
        className={className}
        width={width}
        height={height}
      />
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
