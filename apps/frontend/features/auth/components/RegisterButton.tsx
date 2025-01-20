'use client'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { useTranslations } from 'next-intl'

export function RegisterButton() {
  const translate = useTranslations()
  return (
    <Link href="/register">
      <Button>{translate('auth.register.button')}</Button>
    </Link>
  )
}
