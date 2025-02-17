'use client'

import {UserAvatar} from '@/features/auth/components/UserAvatar'
import {removeFileUpload} from '@/features/file-upload/file-upload.actions'
import {useFileUpload} from '@/features/file-upload/file-upload.hooks'
import {revalidateUser, updateUserData} from '@/features/users/users.actions'
import {checkUsernameTaken} from '@/features/users/users.query'
import type {UserWithImage} from '@/features/users/users.types'
import {useForm} from '@formsignals/form-react'
import {ZodAdapter} from '@formsignals/validation-adapter-zod'
import {useSignals} from '@preact/signals-react/runtime'
import type {UserInsert} from '@repo/database/schema'
import {FieldError, FormError,} from '@repo/design-system/components/FormErrors'
import {FileInlinePreviewsForm} from '@repo/design-system/components/custom/file-inline-previews-form'
import {FileListForm} from '@repo/design-system/components/custom/file-list-form'
import {FileUploadForm} from '@repo/design-system/components/custom/file-upload'
import {Button} from '@repo/design-system/components/ui/button'
import {InputForm} from '@repo/design-system/components/ui/input'
import {Label} from '@repo/design-system/components/ui/label'
import {SwitchForm} from '@repo/design-system/components/ui/switch'
import {TextareaForm} from '@repo/design-system/components/ui/textarea'
import {LoaderCircleIcon, SaveIcon} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {z} from 'zod'

export default function ProfileForm({
  user,
  maxFileSize,
}: { user: UserWithImage; maxFileSize: number }) {
  const t = useTranslations()
  const [progressState, uploadFile] = useFileUpload()

  useSignals()
  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      id: user.id,
      name: user.name,
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
        bio: values.bio,
        url: values.url,
        location: values.location,
        isPublic: values.isPublic,
        allowInvites: values.allowInvites,
      }

      if (file) {
        if (file.size >= maxFileSize) {
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
      className="flex flex-wrap md:flex-nowrap gap-8 mb-8"
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      <form.FormProvider>
        <div className="w-full space-y-4">
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

          <form.FieldProvider name="bio">
            <div className="grid gap-2">
              <Label htmlFor="bio" className="inline-block">
                {t('users.settings.bio')}
              </Label>
              <TextareaForm>{user.bio}</TextareaForm>
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
              <InputForm name="url" />
            </div>
            <FieldError />
          </form.FieldProvider>

          <form.FieldProvider name="location">
            <div className="grid gap-2">
              <Label htmlFor="location" className="inline-block">
                {t('users.settings.location')}
              </Label>
              <InputForm name="location" />
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
        <div className="mb-4 w-1/3">
          <form.FieldProvider
            name="image"
            validator={z
              .any()
              .refine(
                (files: File[]) => files.some((file) => file.size < 10485760),
                'A file is too large',
              )}
          >
            <Label htmlFor="image" className="inline-block mb-2">
              {t('users.settings.profilePicture')}
            </Label>
            <div className="flex flex-col items-center gap-4">
              <UserAvatar user={user} className="w-40 h-40" />
              <div>
                <FileUploadForm
                  accepts="image/*,application/pdf"
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
              </div>
            </div>
          </form.FieldProvider>
        </div>
      </form.FormProvider>
    </form>
  )
}
