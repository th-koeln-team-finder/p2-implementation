'use client'
import { Button } from '@repo/design-system/components/ui/button'
import { signIn } from 'next-auth/webauthn'
import { useTranslations } from 'next-intl'

export function LoginButton() {
  const translate = useTranslations()
  return (
    <Button variant="outline" onClick={() => signIn('passkey')}>
      {translate('auth.login.button')}
    </Button>
  )
}
