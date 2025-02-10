'use client'

import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  WysiwygEditorForm,
  getStringContentFromEditor,
  useLexicalEditorRef,
} from '@repo/design-system/components/WysiwygEditor'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { UserPlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

type ApplyFormValues = {
  firstName: string
  lastName: string
  mail: string
  phone: string
  fileUpload: string
  message: string
}

export default function Application() {
  useSignals()
  //TODO translations
  /* const t = useTranslations('createProjects')*/
  const translateError = useTranslations('validation')

  const form = useForm<ApplyFormValues, typeof ZodAdapter>({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      firstName: '',
      lastName: '',
      mail: '',
      phone: '',
      fileUpload: '',
      message: '',
    },
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
  })

  const editorRef = useLexicalEditorRef()

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <form.FormProvider>
        <h1 className="mb-6 text-xl">Werde Teil des Teams</h1>

        <div className="text-lg">Infos über dich</div>
        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4 lg:w-1/2">
            <form.FieldProvider
              name="firstName"
              validator={z
                .string({ required_error: translateError('required') })
                .min(1, translateError('minLengthX', { amount: 1 }))}
              validatorOptions={{
                validateOnChangeIfTouched: true,
              }}
            >
              <Label>Vorname</Label>
              <InputForm placeholder="Type here..." />
              <FieldError />
            </form.FieldProvider>
          </div>
          <div className="w-full lg:mb-4 lg:w-1/2">
            <form.FieldProvider
              name="lastName"
              validator={z
                .string({ required_error: translateError('required') })
                .min(1, translateError('minLengthX', { amount: 1 }))}
              validatorOptions={{
                validateOnChangeIfTouched: true,
              }}
            >
              <Label>Nachname</Label>
              <InputForm placeholder="Type here..." />
              <FieldError />
            </form.FieldProvider>
          </div>
        </div>
        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4 lg:w-1/2">
            <form.FieldProvider
              name="mail"
              validator={z
                .string({ required_error: translateError('required') })
                .min(1, translateError('minLengthX', { amount: 1 }))}
              validatorOptions={{
                validateOnChangeIfTouched: true,
              }}
            >
              <Label>Mail-Adresse</Label>
              <InputForm placeholder="Type here..." />
              <FieldError />
            </form.FieldProvider>
          </div>
          <div className="w-full lg:mb-4 lg:w-1/2">
            <form.FieldProvider
              name="phone"
              validator={z
                .string({ required_error: translateError('required') })
                .min(1, translateError('minLengthX', { amount: 1 }))}
              validatorOptions={{
                validateOnChangeIfTouched: true,
              }}
            >
              <Label>Telefonnummer</Label>
              <InputForm placeholder="Type here..." />
              <FieldError />
            </form.FieldProvider>
          </div>
        </div>

        <div className="text-lg">Deine Bewerbungsunterlagen</div>
        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4 lg:w-1/2">
            {/*TODO file upload*/}
            <form.FieldProvider
              name="fileUpload"
              validator={z
                .string({ required_error: translateError('required') })
                .min(1, translateError('minLengthX', { amount: 1 }))}
              validatorOptions={{
                validateOnChangeIfTouched: true,
              }}
            >
              <Label>Lade dein Portfolio, Lebenslauf etc. hoch</Label>
              <InputForm placeholder="Type here..." />
              <FieldError />
            </form.FieldProvider>
          </div>
        </div>

        <div className="text-lg">Deine Nachricht</div>

        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="mb-4 w-full">
            <form.FieldProvider
              name="message"
              validator={() => {
                if (!editorRef.current) return null
                return getStringContentFromEditor(editorRef.current).length <= 0
                  ? translateError('required')
                  : null
              }}
            >
              <div>
                <Label>Du möchtest uns noch etwas mitteilen?</Label>
                <WysiwygEditorForm editorRef={editorRef} />
                <FieldError />
              </div>
            </form.FieldProvider>
          </div>
        </div>

        <div className="mb-6 flex w-full justify-center">
          {/*TODO button weiterleitung, save data*/}
          <Button type="submit">
            <UserPlusIcon />
            Join the team
          </Button>
        </div>
      </form.FormProvider>
    </div>
  )
}
