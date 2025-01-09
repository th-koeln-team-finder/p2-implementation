'use client'

// biome-ignore lint/style/useImportType: import type {CreateProjectFormSkills} from "@/features/projects/projects.types";
import { CreateProjectFormSkills } from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
// biome-ignore lint/style/useImportType: zod adapter
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { z } from 'zod'

export function CreateProjectSkills() {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormSkills,
    'skills',
    never,
    typeof ZodAdapter,
    typeof ZodAdapter
  >()
  return (
    <>
      {field.data.value.map((skill, index) => (
        <div key={skill.key} className="flex flex-row gap-4">
          <div className="w-1/2">
            <field.SubFieldProvider
              name={`${index}.skill`}
              validator={z.string().min(1)}
            >
              <Label>Skill</Label>
              <InputForm placeholder="Type skill..." />
              <FieldError />
            </field.SubFieldProvider>
          </div>
          <div className="flex w-1/2 flex-row justify-between">
            <div className="w-5/6">
              <field.SubFieldProvider
                name={`${index}.level`}
                transformFromBinding={(value: string) => {
                  const parsedValue = Number.parseInt(value)
                  if (Number.isNaN(parsedValue))
                    return [0, 'This must be a valid number']
                  return parsedValue
                }}
                transformToBinding={(value, isValid, buffer) => {
                  return isValid ? value.toString() : (buffer ?? '')
                }}
                validator={z.number().min(1).max(5)}
              >
                <Label>Skill Level</Label>
                <InputForm useTransformed type="number" placeholder="1-5" />
                <FieldError />
              </field.SubFieldProvider>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => field.removeValueFromArray(index)}
                variant="outline"
                className="mt-auto rounded-full p-2 hover:border-fuchsia-700"
              >
                <MinusIcon />
              </Button>
              <Button
                onClick={() => field.pushValueToArray({ skill: '', level: '' })}
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
          onClick={() => field.pushValueToArray({ skill: '', level: '' })}
          className="my-3"
          style={{ width: 'fit-content' }}
        >
          Add Skill
        </Button>
      )}
    </>
  )
}
