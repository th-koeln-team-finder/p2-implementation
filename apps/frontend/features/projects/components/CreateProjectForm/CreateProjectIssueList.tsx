'use client'

import type { CreateProjectFormLinks } from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import type { LexicalEditorRef } from '@repo/design-system/components/WysiwygEditor'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { TextareaForm } from '@repo/design-system/components/ui/textarea'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

type CreateProjectIssueListProps = {
  editorRef: LexicalEditorRef
}

export function CreateProjectIssueList({
  editorRef,
}: CreateProjectIssueListProps) {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormLinks,
    'issues',
    never,
    typeof ZodAdapter,
    typeof ZodAdapter
  >()

  const t = useTranslations('createProjects')

  return (
    <>
      {field.data.value.map((issue, index) => (
        <div key={issue.key} className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <field.SubFieldProvider
              name={`${index}.title`}
              validator={z.string().min(1)}
            >
              <Label>{t('issues.title')}</Label>
              <InputForm placeholder={t('issues.titlePlaceholder')} />
              <FieldError />
            </field.SubFieldProvider>
          </div>

          <div className="w-full lg:w-1/2">
            <Label>{t('issues.description')}</Label>
            <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
              <div className="flex w-full flex-col">
                <field.SubFieldProvider
                  name={`${index}.description`}
                  validator={z.string().min(1)}
                >
                  <TextareaForm placeholder={t('issues.descPlaceholder')} />
                  <FieldError />
                </field.SubFieldProvider>
              </div>

              <div className="mt-4 flex gap-2 lg:mt-0">
                <Button
                  onClick={() => field.removeValueFromArray(index)}
                  variant="outline"
                  className="mb-auto rounded-full p-2"
                  size="icon"
                >
                  <MinusIcon />
                </Button>
                <Button
                  onClick={() =>
                    field.pushValueToArray({ title: '', description: '' })
                  }
                  className="mb-auto rounded-full"
                  size="icon"
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {field.data.value.length === 0 && (
        <Button
          onClick={() => field.pushValueToArray({ title: '', description: '' })}
          className="my-3"
          style={{ width: 'fit-content' }}
        >
          {t('issues.addIssue')}
        </Button>
      )}
    </>
  )
}
