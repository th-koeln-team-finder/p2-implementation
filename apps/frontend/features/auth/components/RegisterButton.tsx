'use client'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { useTranslations } from 'next-intl'
import { useSidebar } from '@repo/design-system/components/ui/sidebar'

export function RegisterButton() {
  const { setOpenMobile } = useSidebar()
  const translate = useTranslations()
  return (
    <Link href="/register">
      <Button onClick={() => setOpenMobile(false)}>
        {translate('auth.register.button')}
      </Button>
    </Link>
  )
}
