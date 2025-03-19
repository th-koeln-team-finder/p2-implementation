'use client'

import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { removeFileUpload } from '@/features/file-upload/file-upload.actions'
import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { revalidateUser, updateUserData } from '@/features/users/users.actions'
import { checkUsernameTaken } from '@/features/users/users.query'
import type { UserWithImage } from '@/features/users/users.types'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import type { UserInsert } from '@repo/database/schema'
import {
  FieldError,
  FormError,
} from '@repo/design-system/components/FormErrors'
import { WysiwygEditorForm } from '@repo/design-system/components/WysiwygEditor'
import { FileInlinePreviewsForm } from '@repo/design-system/components/custom/file-inline-previews-form'
import { FileListForm } from '@repo/design-system/components/custom/file-list-form'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { SwitchForm } from '@repo/design-system/components/ui/switch'
import { clientEnv } from '@repo/env/client'
import { LoaderCircleIcon, SaveIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

export default function ProfileForm({ user }: { user: UserWithImage }) {
  const t = useTranslations()
  const translateValidation = useTranslations('validation')
  const [progressState, uploadFile] = useFileUpload()

  useSignals()
  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      id: user.id,
      name: user.name,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      occupation: user.occupation || '',
      bio: user.bio || '',
      url: user.url || '',
      location: user.location || '',
      isPublic: user.isPublic,
      allowInvites: user.allowInvites,
      image: [] as File[],
    },
    onSubmit: async (values) => {
      const file = values.image[0]
      let parsedValues: Partial<UserInsert> = {
        id: values.id,
        name: values.name,
        firstName: values.firstName,
        lastName: values.lastName,
        occupation: values.occupation,
        bio: values.bio,
        url: values.url,
        location: values.location,
        isPublic: values.isPublic,
        allowInvites: values.allowInvites,
      }

      if (file) {
        if (file.size >= clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE) {
          return
        }
        const uploadedFile = await uploadFile(
          `avatar-${values.id}`,
          file.name,
          file,
        )
        if (uploadedFile) {
          parsedValues = {
            ...values,
            image: uploadedFile,
          }
        }
        if (user.image) {
          await removeFileUpload(user.image?.bucketPath)
        }
      }
      await updateUserData(parsedValues).catch((err) => {
        console.error('Error updating user data', err)
      })
      await revalidateUser().catch((err) => {
        console.error('Error revalidating user', err)
      })
    },
  })

  return (
    <form
      className="mb-8 flex flex-wrap gap-8 md:flex-nowrap"
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      <form.FormProvider>
        <div className="order-2 w-full space-y-4 md:order-1">
          <form.FieldProvider
            name="name"
            validator={z
              .string({ required_error: t('validation.required') })
              .min(3, t('validation.minLengthX', { amount: 3 }))}
            validatorAsync={async (name) => {
              if (name === user.name) return null
              const isTaken = await checkUsernameTaken(name)
              if (!isTaken) return null
              return t('validation.usernameTaken')
            }}
            validatorAsyncOptions={{
              debounceMs: 600,
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">{t('auth.register.username')}</Label>
              <InputForm id="name" autoComplete="username webauthn" />
              <FieldError />
            </div>
          </form.FieldProvider>

          <div className="flex gap-4">
            <form.FieldProvider name="firstName">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="firstName" className="inline-block">
                  {t('users.settings.firstName')}
                </Label>
                <InputForm
                  placeholder={t('users.settings.firstNamePlaceholder')}
                  name="firstName"
                />
              </div>
            </form.FieldProvider>
            <form.FieldProvider name="lastName">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="lastName" className="inline-block">
                  {t('users.settings.lastName')}
                </Label>
                <InputForm
                  placeholder={t('users.settings.lastNamePlaceholder')}
                  name="lastName"
                />
              </div>
            </form.FieldProvider>
          </div>

          <form.FieldProvider name="occupation">
            <div className="grid gap-2">
              <Label htmlFor="occupation" className="inline-block">
                {t('users.settings.occupation')}
              </Label>
              <InputForm
                name="occupation"
                placeholder={t('users.settings.occupationPlaceholder')}
              />
            </div>
            <FieldError />
          </form.FieldProvider>

          <form.FieldProvider name="bio">
            <div className="grid gap-2">
              <Label htmlFor="bio" className="inline-block">
                {t('users.settings.bio')}
              </Label>
              <div>
                <WysiwygEditorForm
                  placeholder={t('users.settings.bioPlaceholder')}
                />
              </div>
            </div>
          </form.FieldProvider>

          <form.FieldProvider
            name="url"
            validator={z.string().refine(
              (value) => {
                if (value === '') return true // Allow empty strings
                try {
                  new URL(value) // Check if it's a valid URL
                  return true
                } catch {
                  return false
                }
              },
              { message: t('validation.url') },
            )}
          >
            <div className="grid gap-2">
              <Label htmlFor="url" className="inline-block">
                {t('users.settings.url')}
              </Label>
              <InputForm
                placeholder={t('users.settings.urlPlaceholder')}
                name="url"
              />
            </div>
            <FieldError />
          </form.FieldProvider>

          <form.FieldProvider name="location">
            <div className="grid gap-2">
              <Label htmlFor="location" className="inline-block">
                {t('users.settings.location')}
              </Label>
              <InputForm
                placeholder={t('users.settings.locationPlaceholder')}
                name="location"
              />
            </div>
          </form.FieldProvider>

          <form.FieldProvider name="isPublic">
            <div className="grid gap-2">
              <Label htmlFor="isPublic" className="inline-block">
                {t('users.settings.isPublic')}
              </Label>
              <SwitchForm name="isPublic" className="block" />
            </div>
          </form.FieldProvider>

          <form.FieldProvider name="allowInvites">
            <div className="grid gap-2">
              <Label htmlFor="allowInvites" className="inline-block">
                {t('users.settings.allowInvites')}
              </Label>
              <SwitchForm name="allowInvites" className="block" />
            </div>
          </form.FieldProvider>

          <FormError />

          <Button type="submit" disabled={!form.canSubmit.value}>
            {form.isSubmitting.value ? (
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
            ) : (
              <SaveIcon className="h-4 w-4" />
            )}
            {t('general.save')}
          </Button>
        </div>
        <div className="order-1 mb-4 w-full md:order-2 md:w-1/3">
          <form.FieldProvider
            name="image"
            validator={z.any().refine((files: File[]) => {
              if (files.length === 0) return true
              const file = files[0]
              if (file.size > clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE)
                return translateValidation('fileIsTooLarge')
              if (!clientEnv.NEXT_PUBLIC_ALLOWED_FILE_TYPES.includes(file.type))
                return translateValidation('wrongFileType')
              return true
            })}
          >
            <Label htmlFor="image" className="mb-2 inline-block">
              {t('users.settings.profilePicture')}
            </Label>
            <div className="flex flex-col items-center gap-4">
              <UserAvatar user={user} className="h-40 w-40" />
              <div>
                <FileUploadForm
                  accepts="image/jpeg,image/jpg,image/png"
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
              </div>
            </div>
          </form.FieldProvider>
        </div>
      </form.FormProvider>
    </form>
  )
}
