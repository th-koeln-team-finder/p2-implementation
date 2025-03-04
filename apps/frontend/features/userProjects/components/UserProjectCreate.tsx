'use client'

import {
  addUserProject,
  revalidateUserProjects,
} from '@/features/userProjects/userProjects.actions'
import type { OptimisticPayload } from '@/features/userProjects/userProjects.hooks'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import {
  FieldError,
  FormError,
} from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import { DatePickerForm } from '@repo/design-system/components/ui/datepicker'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { TextareaForm } from '@repo/design-system/components/ui/textarea'
import { format, parse } from 'date-fns'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { z } from 'zod'

export default function UserProjectCreate({
  userId,
  setProjectsOptimistic,
}: {
  userId: string
  setProjectsOptimistic: (payload: OptimisticPayload) => void
}) {
  const t = useTranslations()
  useSignals()

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      joinedDate: new Date(),
      leftDate: null as Date | null,
    }),
    [],
  )
  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues,
    onSubmit: async (values) => {
      const mappedValues = {
        userId: userId,
        visible: true,
        projectName: values.name,
        projectJoinedDate: values.joinedDate.toISOString(),
        projectLeftDate: values.leftDate?.toISOString() || '',
        projectDescription: values.description,
      }
      setProjectsOptimistic({
        action: 'add',
        values: mappedValues,
      })
      await addUserProject(mappedValues)
      form.reset()
      await revalidateUserProjects()
    },
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      <form.FormProvider>
        <Card>
          <CardHeader>
            <CardTitle>{t('users.settings.projects.description')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.FieldProvider
              name="name"
              validator={z.string({ required_error: t('validation.required') })}
            >
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('users.settings.projects.projectName')}
                </Label>
                <InputForm
                  id="name"
                  placeholder={t('users.settings.projects.projectName')}
                />
                <FieldError />
              </div>
            </form.FieldProvider>
            <form.FieldProvider name="description">
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('users.settings.projects.projectDescription')}
                </Label>
                <TextareaForm
                  id="description"
                  placeholder={t(
                    'users.settings.projects.projectDescriptionPlaceholder',
                  )}
                />
                <FieldError />
              </div>
            </form.FieldProvider>
            <form.FieldProvider
              name="joinedDate"
              transformFromBinding={(dateString: string) => {
                const date = parse(dateString, 'dd.MM.y', new Date())
                if (Number.isNaN(date.getTime()))
                  return [undefined, t('validation.date')]
                return date
              }}
              transformToBinding={(value, isValid, buffer = '') =>
                isValid ? (value ? format(value, 'dd.MM.y') : '') : buffer
              }
            >
              <div className="space-y-2">
                <Label>{t('users.settings.projects.joinedDate')}</Label>
                <DatePickerForm />
                <FieldError />
              </div>
            </form.FieldProvider>
            <form.FieldProvider
              name="leftDate"
              validateMixin={['joinedDate']}
              transformFromBinding={(dateString: string) => {
                const date = parse(dateString, 'dd.MM.y', new Date())
                if (Number.isNaN(date.getTime())) return null
                return date
              }}
              transformToBinding={(value, isValid, buffer = '') =>
                isValid ? (value ? format(value, 'dd.MM.y') : '') : buffer
              }
              validator={z
                .tuple([z.date().optional(), z.date().optional()])
                .refine(([leftDate, joinedDate]) => {
                  if (!leftDate || !joinedDate) return true
                  return joinedDate < leftDate
                }, t('users.settings.projects.leftDateValidation'))}
            >
              <div className="space-y-2">
                <Label>{t('users.settings.projects.leftDate')}</Label>
                <DatePickerForm />
                <FieldError />
              </div>
            </form.FieldProvider>
          </CardContent>
          <CardFooter>
            <FormError />
            <Button type="submit" size="sm" disabled={!form.canSubmit.value}>
              {form.isSubmitting.value ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {t('users.settings.projects.addProject')}
            </Button>
          </CardFooter>
        </Card>
      </form.FormProvider>
    </form>
  )
}
