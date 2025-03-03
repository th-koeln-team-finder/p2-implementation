import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import NotificationForm from '@/features/users/components/NotificationForm'
import { getUser } from '@/features/users/users.query'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditProfile() {
  const t = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  const user = await getUser(session.user.id)

  return (
    <div>
      <h2 className="mb-8 font-bold text-2xl">
        {t('users.settings.notifications.title')}
      </h2>

      <NotificationForm user={user} />
    </div>
  )
}
