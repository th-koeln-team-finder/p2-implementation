'use client'

import {
  removeFileUpload,
  revalidateFileUploads,
} from '@/features/file-upload/file-upload.actions'
import type { UploadedFileSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'

export function RemoveFileButton({ file }: { file: UploadedFileSelect }) {
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await removeFileUpload(file.bucketPath)
        await revalidateFileUploads()
      }}
    >
      Delete
    </Button>
  )
}
