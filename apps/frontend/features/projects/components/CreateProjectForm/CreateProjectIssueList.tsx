'use client'

import type { CreateProjectFormLinks } from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  type LexicalEditorRef,
  WysiwygEditorForm,
  getStringContentFromEditor,
} from '@repo/design-system/components/WysiwygEditor'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { MinusIcon, PlusIcon } from 'lucide-react'
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
  return (
    <>
      {field.data.value.map((issue, index) => (
        <div key={issue.key} className="flex flex-row gap-4">
          <div className="w-2/6">
            <field.SubFieldProvider
              name={`${index}.title`}
              validator={z.string().min(1)}
            >
              <Label>Title</Label>
              <InputForm placeholder="Type title..." />
              <FieldError />
            </field.SubFieldProvider>
          </div>

          <div className="flex w-4/6 flex-row justify-between">
            {/* TODO add wysiwyg editor with error */}
            <field.SubFieldProvider
              name={`${index}.description`}
              validator={() => {
                if (!editorRef.current) return null
                return getStringContentFromEditor(editorRef.current).length <= 0
                  ? 'This field is required'
                  : null
              }}
            >
              <div>
                <Label>Description</Label>
                <WysiwygEditorForm editorRef={editorRef} />
                <FieldError />
              </div>
            </field.SubFieldProvider>

            <div className="flex w-1/6 gap-2">
              <Button
                onClick={() => field.removeValueFromArray(index)}
                variant="outline"
                className="mt-auto rounded-full p-2 hover:border-fuchsia-700"
              >
                <MinusIcon />
              </Button>
              <Button
                onClick={() =>
                  field.pushValueToArray({ title: '', description: '' })
                }
                variant="outline"
                className="mt-auto rounded-full border-fuchsia-700 p-2 text-fuchsia-700"
              >
                <PlusIcon />
              </Button>
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
          Add Issue
        </Button>
      )}
    </>
  )
}
