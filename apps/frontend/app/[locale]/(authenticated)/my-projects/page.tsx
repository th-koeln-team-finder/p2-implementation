import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import type { FilterSearchParams } from '@/features/projects/components/FilterBar/filterbar.constants'
import { ProjectList } from '@/features/projects/components/ProjectList'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function MyProjectsPage({
  searchParams,
}: {
  searchParams: Promise<
    {
      search: string
      offset: string
    } & FilterSearchParams
  >
}) {
  const [translate, { search, offset, ...filters }] = await Promise.all([
    getTranslations('projects'),
    searchParams,
  ])

  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 font-semibold text-4xl">
        {translate('myProjects.pageTitle')}
      </h1>
      <ProjectList
        offset={offset}
        search={search}
        filters={filters}
        createdById={session.user.id}
      />
    </div>
  )
}
