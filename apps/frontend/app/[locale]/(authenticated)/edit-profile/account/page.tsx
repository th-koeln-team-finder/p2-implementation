import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import AccountForm from '@/features/users/components/AccountForm'
import DeleteUser from '@/features/users/components/DeleteUser'
import { deleteUser } from '@/features/users/users.actions'
import { getUser } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function Account() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  const user = (await getUser(session.user.id)) as UserSelect

  const _handleDelete = async () => {
    await deleteUser(user.id)
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.account')}
      </h2>

      <AccountForm user={user} />

      <h3 className="my-8 font-bold text-xl">
        {translate('users.settings.dangerZone')}
      </h3>

      <DeleteUser user={user} />
    </section>
  )
}
