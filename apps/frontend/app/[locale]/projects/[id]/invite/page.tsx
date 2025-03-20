import { redirect } from '@/features/i18n/routing'
import { getLocale } from 'next-intl/server'

export default async function NoUserInvite({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = await getLocale()
  return redirect({
    href: `/projects/${id}`,
    locale,
  })
}
