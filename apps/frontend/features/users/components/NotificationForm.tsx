'use client'

import PushNotificationManager from '@/features/test/components/PushNotificationManager'
import { revalidateUser, updateUserData } from '@/features/users/users.actions'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { computed } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import {
  notificationColumns,
  notificationTypesByCategory,
} from '@repo/database/constants'
import type { UserInsert, UserSelect } from '@repo/database/schema'
import { FormError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import { Label } from '@repo/design-system/components/ui/label'
import { SwitchForm } from '@repo/design-system/components/ui/switch'
import { ToggleForm } from '@repo/design-system/components/ui/toggle'
import { Bell, LoaderCircleIcon, LucideMail, SaveIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotificationForm({ user }: { user: UserSelect }) {
  const t = useTranslations()
  useSignals()

  const notificationValues: Record<string, boolean> = Object.keys(
    notificationColumns,
  ).reduce<Record<string, boolean>>(
    (acc: Record<string, boolean>, column: string) => {
      acc[column] = user[column as keyof typeof user] as boolean
      return acc
    },
    {} as Record<string, boolean>,
  )

  const defaultValues: {
    id: string
    activateNotifications: boolean
  } & Partial<UserInsert> = {
    id: user.id,
    activateNotifications: user.activateNotifications,
    ...notificationValues,
  }

  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues,
    onSubmit: async (values) => {
      await updateUserData(values).catch((err) => {
        console.error('Error updating user data', err)
      })
      await revalidateUser().catch((err) => {
        console.error('Error revalidating user', err)
      })
    },
  })

  const isActive = computed(() => {
    return form.data.value.activateNotifications.value
  })

  return (
    <form
      className="mb-8 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      <PushNotificationManager userId={user.id} />
      <form.FormProvider>
        <div className="flex items-end justify-between">
          <form.FieldProvider name="activateNotifications">
            <div className="flex items-center space-x-2">
              <SwitchForm />
              <label
                htmlFor="activateNotifications"
                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('users.settings.notifications.activate')}
              </label>
            </div>
          </form.FieldProvider>
          <div>
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
        </div>
        {(
          Object.keys(
            notificationTypesByCategory,
          ) as (keyof typeof notificationTypesByCategory)[]
        ).map((type) => {
          const notificationType = notificationTypesByCategory[type]
          return (
            <Card
              className={`mb-4 overflow-hidden transition-opacity ${isActive.value ? '' : 'opacity-50'}`}
              key={type}
            >
              <CardHeader className="p-0">
                <CardTitle className="mb-4 border-b px-6 py-4 text-xl">
                  {t(`users.settings.notifications.${type}`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-solid *:py-2 first:*:pt-0 last:*:pb-0">
                {notificationType.map((notification) => {
                  return (
                    <div
                      key={notification}
                      className="flex items-center justify-between gap-4"
                    >
                      <Label
                        htmlFor="notificationType"
                        className="inline-block"
                      >
                        {
                          // @ts-ignore
                          t(`users.settings.notifications.${notification}`)
                        }
                      </Label>
                      <div className="space-x-1">
                        <form.FieldProvider
                          name={`${notification}_push` as keyof UserInsert}
                        >
                          <ToggleForm>
                            <Bell className="h-6 w-6" />
                          </ToggleForm>
                        </form.FieldProvider>
                        <form.FieldProvider
                          name={`${notification}_email` as keyof UserInsert}
                        >
                          <ToggleForm>
                            <LucideMail className="h-6 w-6" />
                          </ToggleForm>
                        </form.FieldProvider>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </form.FormProvider>
    </form>
  )
}
