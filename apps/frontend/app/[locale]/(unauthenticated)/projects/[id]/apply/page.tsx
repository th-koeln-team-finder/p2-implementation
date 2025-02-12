'use client'

import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
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
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { UserPlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import {createApplication, createProject} from "@/features/projects/projects.actions";
import {useRouter} from "@/features/i18n/routing";

type ApplyFormValues = {
  firstName: string
  lastName: string
  mail: string
  phone: string
  bucketPrefix: string
  file: File[]
  fileUpload: string
  message: string
}

export default function Application({ maxFileSize }: { maxFileSize: number }) {
  useSignals()

  const router = useRouter()

  const t = useTranslations('projects.apply')
  const translateError = useTranslations('validation')

  const [progressState, uploadFile, resetFileProgress] = useFileUpload()

  const form = useForm<ApplyFormValues, typeof ZodAdapter>({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      firstName: '',
      lastName: '',
      mail: '',
      phone: '',
      bucketPrefix: 'test',
      file: [] as File[],
      fileUpload: '',
      message: '',
    },
    onSubmit: async (values) => {
      try {
        console.log('Werte:', values)
      if (!values.file) {
        return
      }

        /*console.log('Lade Dateien hoch...')
        await Promise.all(
            values.file.map(async (file) => {
              if (file.size >= maxFileSize) {
                return
              }
              await uploadFile(values.bucketPrefix, file.name, file)
            }),
        )
          console.log('Dateien erfolgreich hochgeladen.')
        setTimeout(() => {
          values.file.map((file) => {
            resetFileProgress(file.name)
          })
          form.reset()
        }, 1000)*/

      console.log('Erstelle Projekt...')
        /*const serverActionData = {
          ...values,
          resources: values.resources.map((r) => ({
            ...r,
            file: [],
          })),
        }
        const projectId = await createProject(serverActionData)*/

        const projectData = {
          name: '',
          description: '',
          status: 'open',
          phase: '',
          location: '',
        }

        const projectId = await createProject(projectData)

      console.log('Projekt erstellt mit ID:', projectId)

      console.log('Erstelle Bewerbung...')
      // Erstellen der Bewerbung
        const applicationData = {
          projectId: projectId,
          firstName: values.firstName,
          lastName: values.lastName,
          mail: values.mail,
          phone: values.phone,
          message: values.message,
        }
        console.log('Bewerbung:', applicationData)

        await createApplication(applicationData)
      console.log('Bewerbung erfolgreich erstellt.')

      //router.push(`/projects/${projectId}`)
      router.push('/projects')
    } catch (error) {
      console.error('Fehler beim Absenden des Formulars:', error.digest)
    }
    }
  })

  const editorRef = useLexicalEditorRef()

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <form.FormProvider>
        <h1 className="mb-6 font-semibold text-2xl">{t('title')}</h1>

        <div className="text-lg">{t('infoTitle')}</div>
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
              <Label>{t('form.firstName')}</Label>
              <InputForm placeholder={t('form.placeholderFirstName')} />
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
              <Label>{t('form.lastName')}</Label>
              <InputForm placeholder={t('form.placeholderLastName')} />
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
                .min(1, translateError('minLengthX', { amount: 1 }))}
              validatorOptions={{
                validateOnChangeIfTouched: true,
              }}
            >
              <Label>{t('form.phone')}</Label>
              <InputForm placeholder={t('form.placeholderPhone')} />
              <FieldError />
            </form.FieldProvider>
          </div>
        </div>

        <div className="text-lg">{t('applyTitle')}</div>
        <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full lg:mb-4">
            <form.FieldProvider
              name="file"
              validator={z
                .any()
                .refine(
                  (files: File[]) => files.some((file) => file.size < 10485760),
                  'A file is too large',
                )}
            >
              <Label>{t('form.fileUpload')}</Label>
              <FileUploadForm
                accepts="image/*,application/pdf"
                multiple
                placeholder={
                  <FileInlinePreviewsForm
                    progressState={progressState}
                    maxFileSize={maxFileSize}
                  />
                }
              />
              <FieldError />
              <FileListForm
                className="my-2"
                progressState={progressState}
                maxFileSize={maxFileSize}
              />
            </form.FieldProvider>
          </div>
        </div>

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
                  editorRef={editorRef}
                  placeholder={t('form.placeholderMessage')}
                />
                <FieldError />
              </div>
            </form.FieldProvider>
          </div>
        </div>

        <div className="mb-6 flex w-full justify-center">
          {/*TODO button weiterleitung, save data*/}
          <Button
            type="submit" /*onClick={onDone}*/
            onClick={async () => {
              await form.handleSubmit()
            }}
          >
            <UserPlusIcon />
            {t('form.submit')}
          </Button>
        </div>
      </form.FormProvider>
    </div>
  )
}
