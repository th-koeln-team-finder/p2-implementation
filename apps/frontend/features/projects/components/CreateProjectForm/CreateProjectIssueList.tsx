'use client'

import type { CreateProjectWithIssuesPayload } from '@/features/projects/projects.actions'
import { useFieldContext } from '@formsignals/form-react'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'

export function CreateProjectIssueList() {
  const field = useFieldContext<CreateProjectWithIssuesPayload, 'issues'>()
  return (
    <div className="flex flex-col gap-2">
      {field.data.value.map((issue, index) => (
        <div key={issue.key}>
          <field.SubFieldProvider name={`${index}.title`}>
            <Label>Title</Label>
            <InputForm />
            <FieldError />
          </field.SubFieldProvider>
          <field.SubFieldProvider name={`${index}.description`}>
            <Label>Description</Label>
            <InputForm />
            <FieldError />
          </field.SubFieldProvider>
          <Button onClick={() => field.removeValueFromArray(index)}>
            Remove Issue
          </Button>
        </div>
      ))}
      <Button
        onClick={() => field.pushValueToArray({ title: '', description: '' })}
      >
        Add Issue
      </Button>
    </div>
  )
}
