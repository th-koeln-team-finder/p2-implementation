'use client'
import { useRouter } from '@/features/i18n/routing'
import { checkUsernameTaken } from '@/features/users/users.query'
import { useForm } from '@formsignals/form-react'
import { configureZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { signIn } from 'next-auth/webauthn'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

const registerAdapter = configureZodAdapter({
  takeFirstError: true,
})

export function RegisterForm() {
  useSignals()
  const router = useRouter()
  const translate = useTranslations()

  const form = useForm({
    validatorAdapter: registerAdapter,
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: async (values) => {
      await signIn('passkey', values)
      router.push('/')
    },
  })

  return (
    <form.FormProvider>
      <Card className="mx-auto w-screen max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <CardHeader>
            <CardTitle className="text-2xl">
              {translate('auth.register.formTitle')}
            </CardTitle>
            <CardDescription>
              {translate('auth.register.formDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form.FieldProvider
                name="name"
                validator={z
                  // biome-ignore lint/style/useNamingConvention: zod uses camelCase
                  .string({ required_error: translate('validation.required') })
                  .min(3, translate('validation.minLengthX', { amount: 3 }))}
                validatorAsync={async (name) => {
                  const isTaken = await checkUsernameTaken(name)
                  if (!isTaken) return null
                  return translate('validation.usernameTaken')
                }}
                validatorAsyncOptions={{
                  debounceMs: 600,
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    {translate('auth.register.username')}
                  </Label>
                  <InputForm
                    id="name"
                    autoComplete="username webauthn"
                    autoFocus
                  />
                  <FieldError />
                </div>
              </form.FieldProvider>
              <form.FieldProvider
                name="email"
                validator={z
                  .string()
                  .min(1, translate('validation.required'))
                  .email(translate('validation.email'))}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {translate('auth.register.email')}
                  </Label>
                  <InputForm id="email" type="email" autoComplete="email" />
                  <FieldError />
                </div>
              </form.FieldProvider>
              <Button
                type="submit"
                className="w-full"
                disabled={!form.canSubmit.value}
              >
                {translate('auth.register.submitButton')}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p>
              {translate('auth.register.alreadyHaveAccount')}
              <Button
                type="button"
                variant="link"
                onClick={() => signIn('passkey')}
              >
                {translate('auth.login.button')}
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </form.FormProvider>
  )
}
