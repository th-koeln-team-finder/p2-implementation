'use client'
import type { CreateProjectFormLinks } from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { FileInlinePreviewsForm } from '@repo/design-system/components/custom/file-inline-previews-form'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {
  SelectContent,
  SelectForm,
  SelectItem,
} from '@repo/design-system/components/ui/select'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

export function CreateProjectLinksList({
  maxFileSize,
  progressState,
}: { maxFileSize: number; progressState?: Record<string, number> }) {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    'resources',
    typeof ZodAdapter
  >()

  const t = useTranslations('createProjects')

  return (
    <>
      {field.data.value.map((link, index) => (
        <field.SubFieldProvider key={link.key} name={`${index}`}>
          <div className="flex flex-row items-start gap-4">
            <CreateProjectLinkListEntry
              maxFileSize={maxFileSize}
              progressState={progressState}
            />
            <div className="mt-6 flex flex-col justify-between lg:flex-row">
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    field.removeValueFromArray(index)
                  }}
                  variant="outline"
                  className="mt-auto rounded-full p-2"
                  size="icon"
                >
                  <MinusIcon />
                </Button>
                <Button
                  onClick={() => {
                    field.pushValueToArray({
                      isDocument: false,
                      label: '',
                      href: '',
                      file: [],
                    })
                  }}
                  className="mt-auto rounded-full"
                  size="icon"
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>
        </field.SubFieldProvider>
      ))}
      {field.data.value.length === 0 && (
        <Button
          onClick={() => {
            field.pushValueToArray({
              isDocument: false,
              label: '',
              href: '',
              file: [],
            })
          }}
          className="my-3"
          style={{ width: 'fit-content' }}
        >
          {t('resources.addLink')}
        </Button>
      )}
    </>
  )
}

function CreateProjectLinkListEntry({
  maxFileSize,
  progressState,
}: { maxFileSize: number; progressState?: Record<string, number> }) {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    `resources.${number}`,
    typeof ZodAdapter
  >()

  const t = useTranslations('createProjects')
  const translateError = useTranslations('validation')
  return (
    <div className="flex flex-1 flex-col gap-4 lg:flex-row">
      <div className="w-full lg:w-3/12">
        <field.SubFieldProvider
          transformToBinding={(value) => (value ? 'fileUpload' : 'link')}
          transformFromBinding={(value: string) => value === 'fileUpload'}
          name="isDocument"
          validator={z.boolean()}
        >
          <div>
            <Label>{t('resources.selection')}</Label>
            <SelectForm
              useTransformed
              valueProps={{ placeholder: t('details.pleaseSelect') }}
            >
              <SelectContent>
                <SelectItem value={'link'}>
                  {t('resources.select.link')}
                </SelectItem>
                <SelectItem value={'fileUpload'}>
                  {t('resources.select.fileUpload')}
                </SelectItem>
              </SelectContent>
            </SelectForm>
            <FieldError />
          </div>
        </field.SubFieldProvider>
      </div>
      <div className="w-full lg:w-3/12">
        <field.SubFieldProvider name="label">
          <div>
            <Label>{t('resources.label')}</Label>
            <InputForm placeholder={t('resources.labelPlaceholder')} />
          </div>
        </field.SubFieldProvider>
      </div>
      <div className="w-full lg:w-6/12">
        {field.data.value.isDocument.value ? (
          <field.SubFieldProvider name="file">
            <Label>{t('resources.fileUpload')}</Label>
            <FileUploadForm
              accepts="image/jpeg,image/jpg,image/png,application/pdf"
              placeholder={
                <FileInlinePreviewsForm
                  progressState={progressState}
                  maxFileSize={maxFileSize}
                  placeholder={undefined}
                />
              }
            />
            <FieldError />
          </field.SubFieldProvider>
        ) : (
          <field.SubFieldProvider
            name="href"
            validator={z
              .string({ required_error: translateError('required') })
              .min(1, translateError('minLengthX', { amount: 1 }))}
            validatorOptions={{
              validateOnChangeIfTouched: true,
            }}
          >
            <Label>{t('resources.url')}</Label>
            <InputForm placeholder={t('resources.urlPlaceholder')} />
            <FieldError />
          </field.SubFieldProvider>
        )}
      </div>
    </div>
  )
}
