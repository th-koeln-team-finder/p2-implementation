'use client'

import type { CreateProjectFormLinks } from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { TextareaForm } from '@repo/design-system/components/ui/textarea'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

export function CreateProjectIssueList() {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    'issues',
    never,
    typeof ZodAdapter,
    typeof ZodAdapter
  >()

  const t = useTranslations('createProjects')
  const translateValidation = useTranslations('validation')
  return (
    <div className="flex flex-col gap-4">
      {field.data.value.map((issue, index) => (
        <div key={issue.key} className="flex flex-row gap-2">
          <div className="w-full">
            <div className="flex-1">
              <field.SubFieldProvider
                name={`${index}.title`}
                validator={z.string().min(1, translateValidation('required'))}
              >
                <Label>{t('issues.title')}</Label>
                <InputForm
                  placeholder={t('issues.titlePlaceholder')}
                  className="text-sm"
                />
                <FieldError />
              </field.SubFieldProvider>
            </div>

            <div className="flex-1">
              <Label>{t('issues.description')}</Label>
              <div className="flex w-full flex-col">
                <field.SubFieldProvider
                  name={`${index}.description`}
                  validator={z.string().min(1, translateValidation('required'))}
                >
                  <TextareaForm
                    placeholder={t('issues.descPlaceholder')}
                    className="text-sm"
                  />
                  <FieldError />
                </field.SubFieldProvider>
              </div>
            </div>
          </div>

          <Button
            onClick={() => field.removeValueFromArray(index)}
            variant="destructive"
            size="icon"
            className="mt-6 min-w-9"
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button
        onClick={() => field.pushValueToArray({ title: '', description: '' })}
        variant="outline"
        className="w-fit"
      >
        <PlusIcon />
        {t('issues.addIssue')}
      </Button>
    </div>
  )
}
