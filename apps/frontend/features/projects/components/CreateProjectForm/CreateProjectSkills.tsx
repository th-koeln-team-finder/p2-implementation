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
import { useTranslations } from 'next-intl'
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

  const t = useTranslations('createProjects')

  return (
    <>
      {field.data.value.map((skill, index) => (
        <div key={skill.key} className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <field.SubFieldProvider
              name={`${index}.name`}
              validator={z.string().min(1)}
            >
              <Label>{t('skills.skill')}</Label>
              <InputForm placeholder={t('skills.skillPlaceholder')} />
              <FieldError />
            </field.SubFieldProvider>
          </div>
          <div className="flex w-full flex-col justify-between lg:w-1/2 lg:flex-row">
            <div className="w-full lg:w-5/6">
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
                <Label>{t('skills.level')}</Label>
                <InputForm useTransformed type="number" placeholder="1-5" />
                <FieldError />
              </field.SubFieldProvider>
            </div>
            <div className="mt-4 flex gap-2 lg:mt-0">
              <Button
                onClick={() => field.removeValueFromArray(index)}
                variant="outline"
                className="mt-auto rounded-full p-2"
                size="icon"
              >
                <MinusIcon />
              </Button>
              <Button
                onClick={() =>
                  field.pushValueToArray({
                    skillId: index + 1,
                    name: '',
                    level: 0,
                  })
                }
                className="mt-auto rounded-full "
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
          onClick={() =>
            field.pushValueToArray({ skillId: 0, name: '', level: 0 })
          }
          className="my-3"
          style={{ width: 'fit-content' }}
        >
          {t('skills.addSkill')}
        </Button>
      )}
    </>
  )
}
