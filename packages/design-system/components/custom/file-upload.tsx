'use client'

import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { SignalifiedData } from '@formsignals/form-core'
import { useFieldContext } from '@formsignals/form-react'
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime'
import { CheckIcon, FileIcon, TrashIcon, UploadIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { type ReactNode, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type FileUploadProps = {
  className?: string
  containerClassName?: string
  multiple?: boolean
  accepts?: string
  placeholder?: ReactNode
}

export function FileUploadForm({
  className,
  containerClassName,
  multiple,
  placeholder = <FieldPlaceholder />,
  accepts,
}: FileUploadProps) {
  useSignals()
  const field = useFieldContext<File[]>()

  return (
    <div className={containerClassName}>
      <Label
        className={cn(
          'relative flex min-h-52 cursor-pointer items-center justify-center rounded border border-border border-dashed ring-ring focus-within:border-foreground focus-within:ring hover:border-foreground',
          className,
        )}
      >
        {placeholder}
        <Input
          type="file"
          accept={accepts}
          multiple={multiple}
          className="absolute inset-0 h-full w-full opacity-0"
          onChange={(e) => {
            if (!e.target.files) {
              field.handleChange(null)
              return
            }
            field.handleChange(Array.from(e.target.files))
          }}
        />
      </Label>
    </div>
  )
}

function FieldPlaceholder() {
  const translate = useTranslations('components.fileUpload')
  return (
    <div className="flex flex-row items-center gap-2">
      <UploadIcon className="h-6 w-6" />
      <span>{translate('placeholderText')}</span>
    </div>
  )
}

type FilePreviewsProps = {
  progressState?: Record<string, number>
  placeholder?: ReactNode
}

export function FilePreviewsForm({
  progressState,
  placeholder = <FieldPlaceholder />,
}: FilePreviewsProps) {
  const field = useFieldContext<File[]>()
  const format = useFormatter()
  const _translate = useTranslations('components.fileUpload')

  const [fieldPreviews, setFieldPreviews] = useState<
    [string, string, string, string][]
  >([])
  useSignalEffect(() => {
    const fieldPreviews = field.data.value.map(
      (file: SignalifiedData<File[]>[number]) => {
        return [
          file.key,
          URL.createObjectURL(file.data.value),
          file.data.value.name,
          file.data.value.type,
        ]
      },
    )
    setFieldPreviews(fieldPreviews)
    return () => {
      for (const [_, url] of fieldPreviews) {
        URL.revokeObjectURL(url)
      }
    }
  })

  if (!fieldPreviews.length) return placeholder

  return (
    <div className="flex max-w-xl flex-row flex-wrap justify-center gap-2">
      {fieldPreviews.map(([key, file, filename, filetype], index) => (
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
      ))}
      {placeholder}
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
        className="h-32 w-32 rounded-sm object-cover"
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

type FileListProps = {
  maxPreviewWidth?: number
  className?: string
  progressState?: Record<string, number>
}

export function FileListForm({
  maxPreviewWidth = 48,
  progressState,
  className,
}: FileListProps) {
  const translate = useTranslations('components.fileUpload')
  const format = useFormatter()
  const field = useFieldContext()
  return (
    <div className={className}>
      <Label>{translate('selectedFileHeader')}</Label>
      <TooltipProvider>
        <ul className="flex flex-col px-1">
          {field.data.value?.map(
            (file: SignalifiedData<File[]>[number], index: number) => (
              <div key={file.key} className="flex flex-row items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <li className="text-sm">
                      {file.data.value.name.slice(0, maxPreviewWidth)}
                      {file.data.value.name.length > maxPreviewWidth && '...'}
                    </li>
                  </TooltipTrigger>
                  <TooltipContent>{file.data.value.name}</TooltipContent>
                </Tooltip>
                <Button
                  size="icon"
                  variant="ghostDestructive"
                  disabled={
                    progressState && file.data.value.name in progressState
                  }
                  type="button"
                  onClick={() => field.removeValueFromArray(index)}
                >
                  <TrashIcon />
                </Button>
                {progressState &&
                  file.data.value.name in progressState &&
                  (progressState[file.data.value.name] < 1 ? (
                    <div className="ml-auto flex flex-row items-center gap-2">
                      <Progress
                        value={progressState[file.data.value.name] * 100}
                        className="w-48"
                      />
                      <p className="min-w-14 text-end text-muted-foreground text-sm">
                        {format.number(progressState[file.data.value.name], {
                          style: 'percent',
                          maximumFractionDigits: 1,
                          minimumFractionDigits: 1,
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="ml-auto flex flex-row items-center gap-1">
                      <CheckIcon className="h-4 w-4 text-success" />
                      <p className="text-muted-foreground text-sm">
                        {translate('finishedText')}
                      </p>
                    </div>
                  ))}
              </div>
            ),
          )}
        </ul>
      </TooltipProvider>
      {!field.data.value?.length && (
        <p className="px-2 text-muted-foreground italic">
          {translate('noFilesSelected')}
        </p>
      )}
    </div>
  )
}
