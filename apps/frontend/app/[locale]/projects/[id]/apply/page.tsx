import ApplicationDetail from '@/features/Application/ApplicationDetails'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/features/i18n/routing'
import { hasSessionPermission } from '@/features/auth/auth.utils'

export default async function Application({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = await getLocale()

  const canCreateApplication = await hasSessionPermission(
    'applyProject',
    'create',
  )
  if (!canCreateApplication) {
    return redirect({
      locale,
      href: `/projects/${id}`,
    })
  }

  return (
    <div className="container mx-auto px-4">
      <ApplicationDetail projectId={id} />
    </div>
  )
}
