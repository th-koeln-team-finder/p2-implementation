import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import ProfileForm from '@/features/users/components/ProfileForm'
import { getUser } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { serverEnv } from '@repo/env'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = (await getUser(session.user.id)) as UserSelect

  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.profile')}
      </h2>

      <ProfileForm user={user} maxFileSize={serverEnv.MAX_FILE_SIZE} />
    </section>
  )
}
