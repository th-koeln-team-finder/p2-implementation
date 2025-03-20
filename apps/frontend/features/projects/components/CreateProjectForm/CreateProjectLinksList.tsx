'use client'
import type { CreateBrainstormResourceFile } from '@/features/brainstorm/brainstorm.types'
import { URL_REGEX } from '@/features/general/url.utils'
import type { CreateProjectFormLinks } from '@/features/projects/projects.types'
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
import { CheckIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { Fragment } from 'react'
import { z } from 'zod'

export function CreateProjectLinksList({
  progressState,
}: { progressState?: Record<string, number> }) {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    'resources',
    typeof ZodAdapter
  >()

  const t = useTranslations('createProjects')

  return (
    <div className="flex flex-col gap-4">
      {field.data.value.map((link, index) => (
        <field.SubFieldProvider key={link.key} name={`${index}`}>
          <CreateProjectLinkListEntry progressState={progressState} />
        </field.SubFieldProvider>
      ))}
      <Button
        onClick={() => {
          field.pushValueToArray({
            isDocument: false,
            label: '',
            href: '',
            file: [],
          })
        }}
        variant="outline"
        className="w-fit"
      >
        <PlusIcon />
        {t('resources.addLink')}
      </Button>
    </div>
  )
}

function CreateProjectLinkListEntry({
  progressState,
}: { progressState?: Record<string, number> }) {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    `resources.${number}`,
    never,
    typeof ZodAdapter,
    typeof ZodAdapter
  >()

  const translate = useTranslations('createProjects')
  const translateValidation = useTranslations('validation')
  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div className="flex flex-row gap-2">
        <field.SubFieldProvider
          name="label"
          validator={z.string().min(1, translateValidation('required'))}
        >
          <div className="flex-1">
            <Label>{translate('resources.label')}</Label>
            <InputForm
              placeholder={translate('resources.labelPlaceholder')}
              className="text-sm"
            />
            <FieldError />
          </div>
        </field.SubFieldProvider>
        <Button
          size="icon"
          className="mt-6 md:hidden"
          variant="destructive"
          onClick={() => {
            field.removeSelfFromArray()
          }}
        >
          <TrashIcon />
        </Button>
      </div>
      <div className="flex flex-[2] flex-row gap-2">
        <div className="flex-1">
          <Label>{translate('details.pleaseSelect')}</Label>
          <div className="flex flex-row">
            <field.SubFieldProvider
              transformToBinding={(value) => (value ? 'fileUpload' : 'link')}
              transformFromBinding={(value: string) => value === 'fileUpload'}
              name="isDocument"
              validator={z.boolean()}
            >
              <SelectForm
                useTransformed
                triggerClassName="m-0 text-sm w-[8ch] rounded-none rounded-l border-input bg-muted p-0 py-0 pr-2 pl-2 font-bold text-input"
              >
                <SelectContent>
                  <SelectItem value={'link'}>
                    {translate('resources.select.link')}
                  </SelectItem>
                  <SelectItem value={'fileUpload'}>
                    {translate('resources.select.fileUpload')}
                  </SelectItem>
                </SelectContent>
              </SelectForm>
            </field.SubFieldProvider>
            {!field.data.value.isDocument.value && (
              <field.SubFieldProvider
                name="href"
                validator={z
                  .string()
                  .regex(URL_REGEX, translateValidation('url'))
                  .min(1, translateValidation('required'))}
              >
                <div className="flex-1">
                  <InputForm
                    placeholder={translate('resources.urlPlaceholder')}
                    className="rounded-none rounded-r text-sm"
                  />
                  <FieldError />
                </div>
              </field.SubFieldProvider>
            )}
            {field.data.value.isDocument.value && (
              <field.SubFieldProvider
                name="file"
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
                      <FileNamePreviewForm uploadProgress={progressState} />
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
          className="mt-6 hidden md:flex"
          variant="destructive"
          onClick={() => {
            field.removeSelfFromArray()
          }}
        >
          <TrashIcon />
        </Button>
      </div>
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
