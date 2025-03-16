'use client'
import { revalidateAll } from '@/features/auth/auth.actions'
import { useRouter } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { signIn } from 'next-auth/webauthn'
import { useTranslations } from 'next-intl'
import { useSidebar } from '@repo/design-system/components/ui/sidebar'

export function LoginButton() {
  const { setOpenMobile } = useSidebar()
  const router = useRouter()
  const translate = useTranslations()
  return (
    <Button
      variant="outline"
      onClick={async () => {
        setOpenMobile(false)
        await signIn('passkey', { redirect: false })
        await revalidateAll()
        setTimeout(() => {
          router.refresh()
        })
      }}
    >
      {translate('auth.login.button')}
    </Button>
  )
}
