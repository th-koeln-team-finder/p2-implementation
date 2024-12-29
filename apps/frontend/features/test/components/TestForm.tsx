'use client'

import { useFieldContext, useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { batch } from '@preact/signals-react'
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { CheckboxForm } from '@repo/design-system/components/ui/checkbox'
import { DatePickerForm } from '@repo/design-system/components/ui/datepicker'
import { Input, InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {
  SelectContent,
  SelectForm,
  SelectItem,
} from '@repo/design-system/components/ui/select'
import { format, intervalToDuration, parse } from 'date-fns'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

type TestFormValues = {
  name: string
  isNice: boolean
  age: number
  gender: 'male' | 'female' | 'not yet decided'
  dateOfBirth?: Date
  phoneNumbers: string[]
}

export function TestForm() {
  // This is important, so that the state updates
  useSignals()
  const translate = useTranslations()

  const form = useForm<TestFormValues, typeof ZodAdapter>({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      name: '',
      gender: 'not yet decided',
      isNice: true,
      age: 1,
      dateOfBirth: undefined,
      phoneNumbers: [],
    },
  })

  return (
    <form.FormProvider>
      <form
        className="flex flex-col gap-2 rounded border border-border p-4"
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
      >
        <h3 className="font-head font-semibold text-2xl">Test Form</h3>
        <form.FieldProvider
          name="name"
          validator={z
            .string()
            .min(3, translate('validation.minLengthX', { amount: 3 }))}
        >
          <div>
            <Label>Name</Label>
            <InputForm />
            <FieldError />
          </div>
        </form.FieldProvider>

        <form.FieldProvider
          name="gender"
          validator={z
            .enum(['male', 'female', 'not yet decided'] as const)
            .refine(
              (v) => v !== 'not yet decided',
              'Oh come on decide now already',
            )}
        >
          <div>
            <Label>Gender</Label>
            <SelectForm>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="not yet decided">Not yet decided</SelectItem>
              </SelectContent>
            </SelectForm>
            <FieldError />
          </div>
        </form.FieldProvider>

        <div className="flex flex-row gap-2">
          <form.FieldProvider
            name="dateOfBirth"
            validator={z.date({
              required_error: translate('validation.required'),
            })}
            transformFromBinding={(dateString: string) => {
              const date = parse(dateString, 'dd.MM.y', new Date())
              if (Number.isNaN(date.getTime()))
                return [undefined, translate('validation.date')]
              return date
            }}
            transformToBinding={(value, isValid, buffer = '') =>
              isValid ? (value ? format(value, 'dd.MM.y') : '') : buffer
            }
          >
            <div className="flex-1">
              <Label>Date Of Birth</Label>
              <DatePickerForm />
              <FieldError />
            </div>
          </form.FieldProvider>
          <form.FieldProvider
            name="age"
            validateMixin={['dateOfBirth']}
            validator={z
              .tuple([
                z
                  .number({
                    required_error: translate('validation.required'),
                    invalid_type_error: translate('validation.required'),
                  })
                  .min(1, translate('validation.positive')),
                z.date().optional(),
              ])
              .refine(([age, dateOfBirth]) => {
                if (!dateOfBirth) return true
                const interval = intervalToDuration({
                  start: dateOfBirth,
                  end: new Date(),
                })
                return (interval.years ?? 0) === age
              }, translate('test.validation.age'))}
            // In this case, we want to convert the string input of the user to a real number
            transformFromBinding={(num: string) => {
              const parsed = Number.parseInt(num)
              // If the value is not a number, we return an error message
              if (Number.isNaN(parsed))
                return [0, translate('validation.number')]
              return parsed
            }}
            transformToBinding={(num, isValid, buffer = '') =>
              isValid ? num.toString() : buffer
            }
          >
            <div className="flex-1">
              <Label>Age</Label>
              <InputForm type="number" useTransformed />
              <FieldError />
            </div>
          </form.FieldProvider>
        </div>

        <form.FieldProvider
          name="isNice"
          validator={z
            .boolean()
            .refine((v) => v, translate('test.validation.nice'))}
        >
          <div>
            <Label className="my-2 flex flex-row items-center gap-2">
              Is nice?
              <CheckboxForm />
            </Label>
            <FieldError />
          </div>
        </form.FieldProvider>

        <form.FieldProvider name="phoneNumbers">
          <PhoneList />
        </form.FieldProvider>

        <Button type="submit" disabled={!form.canSubmit.value}>
          Submit
        </Button>
      </form>
    </form.FormProvider>
  )
}

function PhoneList() {
  const phoneField = useFieldContext<TestFormValues, 'phoneNumbers'>()

  useSignalEffect(() => {
    const phones = [...phoneField.data.value]
    // Since this could potentially update multiple fields, this has to be batched
    batch(() => {
      for (let i = 0; i < phones.length; i++) {
        const phoneNumber = phones[i]
        if (phoneNumber.data?.value) continue
        phoneField.removeValueFromArray(i)
      }
    })
  })

  return (
    <div className="flex flex-col gap-1">
      <Label>Phone Numbers</Label>
      {phoneField.data.value.map((phone, index, arr) => (
        <phoneField.SubFieldProvider key={phone.key} name={`${index}`}>
          <InputForm autoFocus={index === arr.length - 1} />
        </phoneField.SubFieldProvider>
      ))}
      <Input
        placeholder="Start typing phone numbers..."
        onChange={(e) => {
          phoneField.pushValueToArray(e.target.value)
          e.target.value = ''
        }}
      />
    </div>
  )
}
