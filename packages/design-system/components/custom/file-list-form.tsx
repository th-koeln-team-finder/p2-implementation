import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { SignalifiedData } from '@formsignals/form-core'
import { useFieldContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { CheckIcon, FileWarningIcon, TrashIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'

type FileListProps = {
  maxPreviewWidth?: number
  className?: string
  progressState?: Record<string, number>
  maxFileSize: number
}

export function FileListForm({
  maxPreviewWidth = 48,
  progressState,
  className,
  maxFileSize,
}: FileListProps) {
  useSignals()
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
                {file.data.value.size >= maxFileSize && (
                  <div className="ml-auto flex flex-row items-center gap-1">
                    <FileWarningIcon className="h-4 w-4 text-destructive" />
                    <p className="text-muted-foreground text-sm">
                      {translate('errorFileIsTooLarge')}
                    </p>
                  </div>
                )}
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
