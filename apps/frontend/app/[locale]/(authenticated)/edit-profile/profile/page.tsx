import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import ProfileForm from '@/features/users/components/ProfileForm'
import { getUserWithImage } from '@/features/users/users.query'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = await getUserWithImage(session.user.id)
  if (!user) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.profile')}
      </h2>

      <ProfileForm user={user} />
    </section>
  )
}
