import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import UserProjectsEdit from '@/features/projectMemberships/components/UserProjectsEdit'
import { getProjectMemberships } from '@/features/projectMemberships/projectMemberships.query'
import { getUser } from '@/features/users/users.query'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditProjects() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = await getUser(session.user.id)

  const projects = await getProjectMemberships(session.user.id)
  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.projects.title')}
      </h2>

      <UserProjectsEdit userProjects={projects} userId={session.user.id} />
    </section>
  )
}
