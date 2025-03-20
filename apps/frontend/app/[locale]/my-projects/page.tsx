import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import { ProjectList } from '@/features/projects/components/ProjectList'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function MyProjectsPage() {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const [translate] = await Promise.all([getTranslations('projects')])

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 font-semibold text-4xl">
        {translate('myProjects.pageTitle')}
      </h1>
      <ProjectList showUserProjects />
    </div>
  )
}
