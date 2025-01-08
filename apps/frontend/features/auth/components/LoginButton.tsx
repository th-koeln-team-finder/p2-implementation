'use client'
import { revalidateAll } from '@/features/auth/auth.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { signIn } from 'next-auth/webauthn'
import { useTranslations } from 'next-intl'

export function LoginButton() {
  const translate = useTranslations()
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await signIn('passkey', { redirect: false })
        await revalidateAll()
      }}
    >
      {translate('auth.login.button')}
    </Button>
  )
}
