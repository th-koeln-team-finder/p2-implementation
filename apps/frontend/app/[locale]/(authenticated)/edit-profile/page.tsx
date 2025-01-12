import { redirect } from '@/features/i18n/routing'
import { getLocale } from 'next-intl/server'

export default async function EditProfile() {
  const locale = await getLocale()

  return redirect({
    href: '/edit-profile/profile',
    locale,
  })
}
