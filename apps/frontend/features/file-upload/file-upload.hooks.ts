import {
  confirmFileUpload,
  getPresignedUploadUrl,
  revalidateFileUploads,
} from '@/features/file-upload/file-upload.actions'
import { useCallback, useState } from 'react'

export function useFileUpload() {
  const [progressState, setProgressState] = useState<Record<string, number>>({})

  const uploadFile = useCallback(
    async (bucketPrefix: string, filename: string, file: File) => {
      const bucketPath = `${bucketPrefix}/${filename}`
      const [uploadUrl, fileId] = await getPresignedUploadUrl(
        bucketPath,
        file.type,
        file.size,
      )
      console.log({ fileId })
      if (!uploadUrl) {
        return
      }

      return new Promise<string | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) {
            return
          }

          setProgressState((prevState) => ({
            ...prevState,
            [file.name]: event.loaded / event.total,
          }))
        }

        xhr.onerror = () => {
          console.error('Error uploading file')
          reject()
        }

        xhr.onload = async () => {
          if (xhr.status !== 200) {
            console.error('Error uploading file', xhr.responseText)
            reject()
            return
          }
          await confirmFileUpload(bucketPath)
          revalidateFileUploads()
            .then(() => {
              resolve(fileId)
            })
            .catch((error) => {
              console.error('Error confirming file upload', error)
              reject()
            })
        }

        xhr.open('PUT', uploadUrl, true)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    },
    [],
  )

  const resetFileProgress = useCallback((filename: string) => {
    setProgressState((prevState) => {
      const newState = { ...prevState }
      delete newState[filename]
      return newState
    })
  }, [])

  return [progressState, uploadFile, resetFileProgress] as const
}
