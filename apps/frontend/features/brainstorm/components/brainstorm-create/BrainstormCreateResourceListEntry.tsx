import type {
  CreateBrainstormFormValues,
  CreateBrainstormResourceFile,
} from '@/features/brainstorm/brainstorm.types'
import { URL_REGEX } from '@/features/general/url.utils'
import { useFieldContext } from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { Progress } from '@repo/design-system/components/ui/progress'
import {
  SelectContent,
  SelectForm,
  SelectItem,
} from '@repo/design-system/components/ui/select'
import { clientEnv } from '@repo/env/client'
import { CheckIcon, FileIcon, TrashIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { Fragment, useState } from 'react'
import { z } from 'zod'

type BrainstormCreateResourceListEntryProps = {
  uploadProgress?: Record<string, number> | undefined
  popoverContainerId?: string
  onPopoverOpenChange?: (isOpen: boolean) => void
}

export function BrainstormCreateResourceListEntry({
  uploadProgress,
  popoverContainerId,
  onPopoverOpenChange,
}: BrainstormCreateResourceListEntryProps) {
  useSignals()
  const translateValidation = useTranslations('validation')
  const translate = useTranslations('brainstorm.createForm')
  const field = useFieldContext<
    CreateBrainstormFormValues,
    `resources.${number}`,
    never,
    never,
    typeof ZodAdapter
  >()
  const fieldData = field.data.peek()
  const [selectOpen, setSelectOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <field.SubFieldProvider
        name="label"
        validator={z.string().min(1, translateValidation('required'))}
      >
        <div className="flex-1">
          <Label>{translate('resourceLabelName')}</Label>
          <InputForm placeholder={translate('resourcePlaceholderName')} />
          <FieldError />
        </div>
      </field.SubFieldProvider>
      <div className="flex-[2]">
        <Label>{translate('resourceLabelData')}</Label>
        <div className="flex flex-row">
          <field.SubFieldProvider name="type">
            <SelectForm
              triggerClassName="m-0 text-sm w-[8ch] rounded-none rounded-l border-input bg-muted p-0 py-0 pr-2 pl-2 font-bold text-input"
              open={selectOpen}
              onOpenChange={(open) => {
                setSelectOpen(open)
                onPopoverOpenChange?.(open)
              }}
            >
              <SelectContent containerId={popoverContainerId}>
                <SelectItem value="link">
                  {translate('resourceTypeSelectLink')}
                </SelectItem>
                <SelectItem value="file">
                  <div className="flex flex-row items-center gap-1">
                    <FileIcon className="h-5 w-5" />
                    {translate('resourceTypeSelectFile')}
                  </div>
                </SelectItem>
              </SelectContent>
            </SelectForm>
          </field.SubFieldProvider>
          {fieldData.type.value === 'link' && (
            <field.SubFieldProvider
              name="value"
              validator={z
                .string()
                .regex(URL_REGEX, translateValidation('url'))
                .min(1, translateValidation('required'))}
            >
              <div className="flex-1">
                <InputForm
                  placeholder={translate('resourcePlaceholderLink')}
                  className="rounded-none rounded-r text-sm"
                />
                <FieldError />
              </div>
            </field.SubFieldProvider>
          )}
          {fieldData.type.value === 'file' && (
            <field.SubFieldProvider
              name="fileValue"
              validator={(file: File[]) => {
                if (!file.length) return translateValidation('required')
                if (file[0].size > clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE)
                  return translateValidation('fileIsTooLarge')
                if (
                  !clientEnv.NEXT_PUBLIC_ALLOWED_FILE_TYPES.includes(
                    file[0].type,
                  )
                )
                  return translateValidation('wrongFileType')
                return undefined
              }}
              validateOnNestedChange
            >
              <div className="flex-1">
                <FileUploadForm
                  accepts="image/jpeg,image/jpg,image/png,application/pdf"
                  placeholder={
                    <FileNamePreviewForm uploadProgress={uploadProgress} />
                  }
                  className="max-h-9 min-h-9 w-full justify-start overflow-hidden rounded-none rounded-r px-2 py-2"
                  containerClassName="flex-1"
                />
                <FieldError />
              </div>
            </field.SubFieldProvider>
          )}
        </div>
      </div>
      <Button
        size="icon"
        className="md:mt-6"
        variant="destructive"
        onClick={() => {
          field.removeSelfFromArray()
        }}
      >
        <TrashIcon />
      </Button>
    </div>
  )
}

interface FileNamePreviewFormProps {
  uploadProgress?: Record<string, number> | undefined
}

function FileNamePreviewForm({ uploadProgress }: FileNamePreviewFormProps) {
  useSignals()
  const format = useFormatter()
  const translate = useTranslations()
  const field = useFieldContext<CreateBrainstormResourceFile['fileValue'], ''>()
  const fileName = field.data.value?.[0]?.data?.value?.name
  if (!fileName) {
    return (
      <p className="font-normal text-muted-foreground text-sm">
        {translate('brainstorm.createForm.resourcePlaceholderFile')}
      </p>
    )
  }
  return (
    <div className="flex w-full flex-row items-center gap-2 pr-4">
      <p className="max-w-[6ch] text-nowrap text-sm">{fileName}</p>
      {uploadProgress?.[fileName] && uploadProgress?.[fileName] < 1 && (
        <Fragment>
          <Progress
            value={uploadProgress?.[fileName] * 100}
            className="ml-auto w-32 min-w-32"
          />
          <p>
            {format.number(uploadProgress?.[fileName] ?? 0, {
              style: 'percent',
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            })}
          </p>
        </Fragment>
      )}
      {uploadProgress?.[fileName] && uploadProgress[fileName] >= 1 && (
        <div className="ml-auto flex flex-row items-center gap-1">
          <CheckIcon className="h-4 w-4 text-success" />
          <p className="text-muted-foreground text-sm">
            {translate('components.fileUpload.finishedText')}
          </p>
        </div>
      )}
    </div>
  )
}
