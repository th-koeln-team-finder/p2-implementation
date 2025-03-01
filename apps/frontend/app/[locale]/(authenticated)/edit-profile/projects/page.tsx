import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import UserProjectsEdit from '@/features/userProjects/components/UserProjectsEdit'
import { getUserProjects } from '@/features/userProjects/userProjects.query'
import { getUser } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditProjects() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = await getUser(session.user.id)

  const projects = await getUserProjects(user.id)
  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.projects.title')}
      </h2>

      <UserProjectsEdit userProjects={projects} userId={user.id} />
    </section>
  )
}
