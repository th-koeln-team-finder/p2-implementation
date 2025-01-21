'use client'

import {Label} from "@repo/design-system/components/ui/label";
import {InputForm} from "@repo/design-system/components/ui/input";
import {UserSelect} from "@repo/database/schema";
import {useTranslations} from "next-intl";
import {revalidateUser, updateUserData} from "@/features/users/users.actions";
import {SelectContent, SelectForm, SelectItem} from "@repo/design-system/components/ui/select";
import {useSignals} from "@preact/signals-react/runtime";
import {useForm} from "@formsignals/form-react";
import {ZodAdapter} from "@formsignals/validation-adapter-zod";
import {z} from "zod";
import {FieldError, FormError} from "@repo/design-system/components/FormErrors";
import {LoaderCircleIcon, SaveIcon} from "lucide-react";
import {Button} from "@repo/design-system/components/ui/button";

export default function AccountForm({user}: { user: UserSelect }) {
  const t = useTranslations()

  useSignals()
  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      name: user.name,
      email: user.email,
      languagePreference: user.languagePreference,
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

  return (
    <form
      className="space-y-4 mb-8"
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      <form.FormProvider>
        <form.FieldProvider
          name="email"
          validator={z
            .string()
            .min(1, t('validation.required'))
            .email(t('validation.email'))}
          validatorOptions={{
            validateOnChangeIfTouched: true,
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">
              {t('auth.register.email')}
            </Label>
            <InputForm id="email" type="email" autoComplete="email"/>
            <FieldError/>
          </div>
        </form.FieldProvider>

        <form.FieldProvider
          name="languagePreference"
          validator={z
            .enum(['en', 'de'] as const)}
        >
          <div className="grid gap-2">
            <Label htmlFor={'languagePreference'}>
              {t('users.settings.language')}
            </Label>
            <SelectForm>
              <SelectContent>
                <SelectItem value="en">
                  English
                </SelectItem>
                <SelectItem value="de">
                  Deutsch
                </SelectItem>
              </SelectContent>
            </SelectForm>
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
      </form.FormProvider>
    </form>
  )
}