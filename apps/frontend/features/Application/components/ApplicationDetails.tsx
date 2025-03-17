'use client'

import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useRouter } from '@/features/i18n/routing'
import { createApplication } from '@/features/projects/projects.actions'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useComputed, useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  WysiwygEditorForm,
  getStringContentFromEditor,
  useLexicalEditorRef,
} from '@repo/design-system/components/WysiwygEditor'
import { FileInlinePreviewsForm } from '@repo/design-system/components/custom/file-inline-previews-form'
import { FileListForm } from '@repo/design-system/components/custom/file-list-form'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { CheckboxForm } from '@repo/design-system/components/ui/checkbox'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { clientEnv } from '@repo/env/client'
import { UserPlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { z } from 'zod'

type ApplyFormValues = {
  checkbox: boolean
  mail: string
  phone: string
  bucketPrefix: string
  file: File[]
  message: string
}

type ApplicationDetailProps = {
  projectId: string
}

export default function ApplicationDetail({
  projectId,
}: ApplicationDetailProps) {
  useSignals()

  const { data: session } = useSession()
  const router = useRouter()

  const t = useTranslations('projects.apply')
  const translateError = useTranslations('validation')

  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [progressState, uploadFile, resetFileProgress] = useFileUpload()

  const form = useForm<ApplyFormValues, typeof ZodAdapter>({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      checkbox: false,
      mail: '',
      phone: '',
      bucketPrefix: 'test',
      file: [] as File[],
      message: '',
    },
    onSubmit: async (values) => {
      if (!session?.user?.id) return

      const fileIds = await Promise.all(
        values.file.map((file) =>
          uploadFile(values.bucketPrefix, file.name, file),
        ),
      )

      await createApplication(
        {
          projectId,
          userId: session.user.id,
          mail: values.mail,
          phone: values.phone,
          message: values.message,
        },
        fileIds.filter((e): e is string => !!e),
      )

      setAlertMessage('Deine Anfrage wurde versendet.')
      setTimeout(() => {
        setAlertMessage(null)
      }, 5000)

      setTimeout(() => {
        values.file.map((file) => {
          resetFileProgress(file.name)
        })
        form.reset()
        router.replace(`/projects/${projectId}`)
      }, 1000)
    },
  })
  const prefersInternalCommunication = useComputed(() => {
    return form.data.value.checkbox.value
  })

  const editorRef = useLexicalEditorRef()

  return (
    <form.FormProvider>
      <form
        className="container mx-auto max-w-screen-lg px-4"
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
      >
        <h1 className="mb-6 font-semibold text-2xl">{t('title')}</h1>

        {alertMessage && (
          <div className="-translate-x-1/2 fixed top-4 left-1/2 z-101 rounded-lg border-2 border-primary bg-background p-8 text-normal">
            {alertMessage}
          </div>
        )}

        <div className="text-lg">{t('infoTitle')}</div>
        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4 lg:w-1/2">
            <Label>{t('form.name')}</Label>
            {session?.user?.firstName && session?.user?.lastName ? (
              <p>
                {session?.user?.firstName} {session?.user?.lastName}
              </p>
            ) : (
              <p>{session?.user?.name}</p>
            )}
          </div>
        </div>

        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4 lg:w-1/2">
            <form.FieldProvider name="checkbox" validator={z.boolean()}>
              <Label>{t('form.checkbox')}</Label> <br />
              <div className="flex flex-row items-center gap-4">
                <CheckboxForm />
                <p>{t('form.checkboxText')}</p>
              </div>
            </form.FieldProvider>
          </div>
        </div>

        {!prefersInternalCommunication.value && (
          <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full lg:mb-4 lg:w-1/2">
              <form.FieldProvider
                name="mail"
                validator={z
                  .string()
                  .email({ message: translateError('email') })
                  .min(4, translateError('minLengthX', { amount: 4 }))}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <Label>{t('form.mail')}</Label>
                <InputForm placeholder={t('form.placeholderMail')} />
                <FieldError />
              </form.FieldProvider>
            </div>
            <div className="w-full lg:mb-4 lg:w-1/2">
              <form.FieldProvider
                name="phone"
                validator={z
                  .string({ required_error: translateError('required') })
                  .regex(/^\+?[1-9]\d{1,14}$/, translateError('phone'))
                  .min(7, translateError('minLengthX', { amount: 7 }))}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <Label>{t('form.phone')}</Label>
                <InputForm
                  type="tel"
                  placeholder={t('form.placeholderPhone')}
                />
                <FieldError />
              </form.FieldProvider>
            </div>
          </div>
        )}

        <div className="text-lg">{t('messageTitle')}</div>
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
                <Label>{t('form.message')}</Label>
                <WysiwygEditorForm
                  className="min-h-56"
                  editorRef={editorRef}
                  placeholder={t('form.placeholderMessage')}
                />
                <FieldError />
              </div>
            </form.FieldProvider>
          </div>
        </div>

        <div className="text-lg">{t('applyTitle')}</div>
        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4">
            <form.FieldProvider name="file">
              <Label>{t('form.fileUpload')}</Label>
              <FileUploadForm
                accepts="image/jpeg,image/png,application/pdf"
                multiple
                placeholder={
                  <FileInlinePreviewsForm
                    progressState={progressState}
                    maxFileSize={clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE}
                  />
                }
              />
              <FieldError />
              <FileListForm
                className="my-2"
                progressState={progressState}
                maxFileSize={clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE}
              />
            </form.FieldProvider>
          </div>
        </div>

        <div className="mb-6 flex w-full justify-center">
          <Button
            type="submit"
            onClick={async () => {
              await form.handleSubmit()
            }}
          >
            <UserPlusIcon />
            {t('form.submit')}
          </Button>
        </div>
      </form>
    </form.FormProvider>
  )
}
