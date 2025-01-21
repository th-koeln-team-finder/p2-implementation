'use client'

import {Label} from "@repo/design-system/components/ui/label";
import {InputForm} from "@repo/design-system/components/ui/input";
import {TextareaForm} from "@repo/design-system/components/ui/textarea";
import {UserSelect} from "@repo/database/schema";
import {useTranslations} from "next-intl";
import {revalidateUser, updateUserData} from "@/features/users/users.actions";
import {SwitchForm} from "@repo/design-system/components/ui/switch";
import {useForm} from "@formsignals/form-react";
import {ZodAdapter} from "@formsignals/validation-adapter-zod";
import {useSignals} from "@preact/signals-react/runtime";
import {z} from "zod";
import {FieldError, FormError} from "@repo/design-system/components/FormErrors";
import {LoaderCircleIcon, SaveIcon} from "lucide-react";
import {Button} from "@repo/design-system/components/ui/button";
import {checkUsernameTaken} from "@/features/users/users.query";

export default function ProfileForm({user}: { user: UserSelect }) {
  const t = useTranslations()
  const translateError = useTranslations('validation')

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
      image: user.image,
    },
    onSubmit: async (values) => {
      await updateUserData(values).catch((err) => {
        console.error('Error updating user data', err)
      })
      await revalidateUser().catch((err) => {
        console.error('Error revalidating user', err)
      })
    },
  })

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  });

  const setUserProfilePic = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await toBase64(file)
    if (typeof image !== 'string') return

    /*setFormData({
      ...formData,
      image: image
    })
    updateUserProperties()*/
  }

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
              .string({required_error: t('validation.required')})
              .min(3, t('validation.minLengthX', {amount: 3}))}
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
              <Label htmlFor="name">
                {t('auth.register.username')}
              </Label>
              <InputForm
                id="name"
                autoComplete="username webauthn"
              />
              <FieldError/>
            </div>
          </form.FieldProvider>

          <form.FieldProvider
            name="bio"
          >
            <div className="grid gap-2">
              <Label htmlFor="bio" className="inline-block">{t('users.settings.bio')}</Label>
              <TextareaForm>
                {user.bio}
              </TextareaForm>
            </div>
          </form.FieldProvider>

          <form.FieldProvider
            name="url"
            validator={z.string().url(t('validation.url'))}
          >
            <div className="grid gap-2">
              <Label htmlFor="url" className="inline-block">{t('users.settings.url')}</Label>
              <InputForm name="url"/>
            </div>
          </form.FieldProvider>

          <form.FieldProvider
            name="location"
          >
            <div className="grid gap-2">
              <Label htmlFor="location" className="inline-block">{t('users.settings.location')}</Label>
              <InputForm name="location"/>
            </div>
          </form.FieldProvider>

          <form.FieldProvider
            name="isPublic"
          >
            <div className="grid gap-2">
              <Label htmlFor="isPublic" className="inline-block">{t('users.settings.isPublic')}</Label>
              <SwitchForm name="isPublic" className="block"/>
            </div>
          </form.FieldProvider>

          <form.FieldProvider
            name="allowInvites"
          >
            <div className="grid gap-2">
              <Label htmlFor="allowInvites" className="inline-block">{t('users.settings.allowInvites')}</Label>
              <SwitchForm name="allowInvites" className="block"/>
            </div>
          </form.FieldProvider>

          <FormError/>

          <Button
            type="submit"
            disabled={!form.canSubmit.value}
          >
            {form.isSubmitting.value
              ? <LoaderCircleIcon className="h-4 w-4 animate-spin"/>
              : <SaveIcon className="h-4 w-4"/>
            }
            {t('general.save')}
          </Button>
        </div>
        <div className="mb-4 w-1/3">
          {/*<form.FieldProvider
            name="image"
          >
            <Label htmlFor="image" className="inline-block mb-2">{t('users.settings.profilePicture')}</Label>
            <div className="flex items-center gap-4">
              <UserAvatar user={user} className="w-40 h-40"/>
              <InputForm type="file" name="image" className="mb-4 w-40"/>
            </div>
          </form.FieldProvider>*/}
        </div>
      </form.FormProvider>
    </form>
  )
}