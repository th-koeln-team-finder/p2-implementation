'use client'

// biome-ignore lint/style/useImportType: import type {CreateProjectFormLinks} from "@/features/projects/projects.types";
import { CreateProjectFormLinks } from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
// biome-ignore lint/style/useImportType: zod adapter
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
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
import { useState } from 'react'
import { z } from 'zod'

export function CreateProjectLinksList() {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    'ressources',
    typeof ZodAdapter
  >()
  const [ressourceFormats, setRessourceFormats] = useState<(boolean | null)[]>(
    [],
  )

  const handleFormatChange = (index: number, value: boolean) => {
    const updatedFormats = [...ressourceFormats]
    updatedFormats[index] = value
    setRessourceFormats(updatedFormats)
  }

  const t = useTranslations('createProjects')

  return (
    <>
      {field.data.value.map((link, index) => (
        <div key={link.key} className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-3/12">
            <field.SubFieldProvider
              name={`${index}.isDocument`}
              validator={z.boolean()}
            >
              <div>
                <Label>{t('resources.selection')}</Label>
                <SelectForm
                  value={
                    ressourceFormats[index] === undefined
                      ? ''
                      : // biome-ignore lint/nursery/noNestedTernary: needed for select placeholder
                        ressourceFormats[index]
                        ? 'true'
                        : 'false'
                  }
                  onValueChange={(value) => {
                    handleFormatChange(index, value)
                  }}
                  valueProps={{ placeholder: 'Bitte auswählen' }}
                >
                  <SelectContent>
                    <SelectItem value={false}>
                      {t('resources.select.link')}
                    </SelectItem>
                    <SelectItem value={true}>
                      {t('resources.select.fileUpload')}
                    </SelectItem>
                  </SelectContent>
                </SelectForm>
                <FieldError />
              </div>
            </field.SubFieldProvider>
          </div>
          <div className="w-full lg:w-3/12">
            <field.SubFieldProvider name={`${index}.label`}>
              <div>
                <Label>{t('resources.label')}</Label>
                <InputForm placeholder={t('resources.labelPlaceholder')} />
              </div>
            </field.SubFieldProvider>
          </div>
          <div className="w-full lg:w-6/12">
            {!ressourceFormats[index] && (
              <field.SubFieldProvider
                name={`${index}.href`}
                validator={z.string().min(1)}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <Label>{t('resources.url')}</Label>
                <InputForm placeholder={t('resources.urlPlaceholder')} />
                <FieldError />
              </field.SubFieldProvider>
            )}
            {ressourceFormats[index] && (
              <field.SubFieldProvider name={`${index}.file`}>
                <Label>{t('resources.fileUpload')}</Label>
                {/*TODO: File Upload*/}

                {/* <FieldError/> */}
              </field.SubFieldProvider>
            )}
          </div>
          <div className="flex flex-col justify-between lg:flex-row">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  field.removeValueFromArray(index)
                  setRessourceFormats((prev) =>
                    prev.filter((_, i) => i !== index),
                  )
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
                    label: '',
                    href: '',
                    file: '',
                    isDocument: undefined,
                  })
                  setRessourceFormats((prev) => [...prev, null])
                }}
                className="mt-auto rounded-full"
                size="icon"
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {field.data.value.length === 0 && (
        <Button
          onClick={() => {
            field.pushValueToArray({
              label: '',
              href: '',
              file: '',
              isDocument: undefined,
            })
            setRessourceFormats([null])
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
