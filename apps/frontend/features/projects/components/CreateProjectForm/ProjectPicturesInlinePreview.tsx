import type { SignalifiedData } from '@formsignals/form-core'
import { useFieldContext } from '@formsignals/form-react'
import { useSignalEffect } from '@preact/signals-react/runtime'
import { Button } from '@repo/design-system/components/ui/button'
import { Progress } from '@repo/design-system/components/ui/progress'
import { FileIcon, FileWarningIcon, TrashIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useState } from 'react'

type FilePreviewsProps = {
  progressState?: Record<string, number>
  maxFileSize: number
}

export function ProjectPicturesInlinePreview({
  progressState,
  maxFileSize,
}: FilePreviewsProps) {
  const field = useFieldContext<File[], ''>()
  const format = useFormatter()
  const translate = useTranslations('components.fileUpload')

  const [fieldPreviews, setFieldPreviews] = useState<
    (readonly [string, string, string, string, number])[]
  >([])
  useSignalEffect(() => {
    const fieldPreviews = field.data.value.map(
      (file: SignalifiedData<File[]>[number]) => {
        return [
          file.key,
          URL.createObjectURL(file.data.value),
          file.data.value.name,
          file.data.value.type,
          file.data.value.size,
        ] as const
      },
    )
    setFieldPreviews(fieldPreviews)
    return () => {
      for (const [_, url] of fieldPreviews) {
        URL.revokeObjectURL(url)
      }
    }
  })

  if (!fieldPreviews.length)
    return (
      <p className="px-2 text-center text-sm">
        {translate('placeholderTextMultiple')}
      </p>
    )

  return (
    <div className="m-4">
      <p className="mb-2 text-center text-sm">
        {translate('placeholderTextMultiple')}
      </p>
      <div className="grid max-h-72 max-w-xl grid-cols-1 gap-2 overflow-auto pr-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {fieldPreviews.map(
          ([key, file, filename, filetype, filesize], index) => (
            <div key={key} className="relative">
              <FileObjectPreview file={file} filetype={filetype} />
              <Button
                size="icon"
                variant="destructive"
                disabled={progressState && filename in progressState}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  field.removeValueFromArray(index)
                }}
                className="absolute top-1 right-1 z-50"
              >
                <TrashIcon />
              </Button>
              {filesize >= maxFileSize && (
                <div className="absolute right-0 bottom-0 left-0 flex flex-row items-center gap-1 bg-destructive p-1 text-destructive-foreground">
                  <FileWarningIcon className="h-4 w-4" />
                  <p className="text-xs">{translate('errorFileIsTooLarge')}</p>
                </div>
              )}
              {progressState && filename in progressState && (
                <div className="absolute right-1 bottom-1 left-1">
                  <p>
                    {format.number(progressState[filename], {
                      style: 'percent',
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })}
                  </p>
                  <Progress
                    value={progressState[filename] * 100}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )
}

type FileObjectPreviewProps = {
  file: string
  filetype: string
}

function FileObjectPreview({ file, filetype }: FileObjectPreviewProps) {
  const translate = useTranslations('components.fileUpload')
  if (filetype.startsWith('image')) {
    return (
      // biome-ignore lint/nursery/noImgElement: This cannot be server optimized, therefore, a normal image tag is just fine
      <img
        src={file}
        className="size-48 rounded-sm object-cover"
        alt="Preview"
      />
    )
  }
  if (filetype === 'application/pdf') {
    return <embed src={file} className="h-32 w-32" />
  }
  return (
    <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 p-1 text-muted-foreground">
      <FileIcon />
      <small>{translate('noPreviewAvailable')}</small>
    </div>
  )
}
