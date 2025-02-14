import {authMiddleware} from '@/auth'
import {redirect} from '@/features/i18n/routing'
import {getUser} from '@/features/users/users.query'
import type {UserSelect} from '@repo/database/schema'
import {getLocale, getTranslations} from 'next-intl/server'
import NotificationForm from "@/features/users/components/NotificationForm";

export default async function EditProfile() {
  const t = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  const user = (await getUser(session.user.id)) as UserSelect

  return (
    <div>
      <h2 className="font-bold text-2xl mb-8">
        {t('users.settings.notifications.title')}
      </h2>

      <NotificationForm user={user} />
    </div>
  )
}
