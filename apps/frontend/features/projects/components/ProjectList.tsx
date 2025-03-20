import { authMiddleware } from '@/auth'
import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { LazyLoader } from '@/features/general/components/LazyLoader'
import type { FilterSearchParams } from '@/features/projects/components/FilterBar/filterbar.constants'
import { parseFilters } from '@/features/projects/components/FilterBar/filterbar.utils'
import { ProjectListEntry } from '@/features/projects/components/ProjectListEntry'
import {
  getProjectItems,
  getProjectItemsForUser,
} from '@/features/projects/projects.queries'
import { getTranslations } from 'next-intl/server'

type ProjectListProps = {
  search?: string
  offset?: string
  filters: FilterSearchParams
  showUserProjects?: false
}

type MyProjectsListProps = {
  offset?: string
  showUserProjects: true
}

const pageSize = 15

export async function ProjectList(
  props: ProjectListProps | MyProjectsListProps,
) {
  const session = await authMiddleware()
  const translate = await getTranslations('projects')
  let projects = []

  const offsetNumber = Number.parseInt(props.offset ?? '0')
  const limit = pageSize + offsetNumber

  if (session?.user?.id && props.showUserProjects) {
    projects = await getProjectItemsForUser(session.user.id, limit)
  } else {
    const { search, filters } = props as ProjectListProps
    projects = await getProjectItems(
      search || '',
      parseFilters(filters),
      limit,
      session?.user?.id,
    )
  }

  const hasMore = limit <= projects.length

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!projects.length && (
          <p className="col-span-full my-3 text-center text-muted-foreground italic">
            {translate('emptyProjects')}
          </p>
        )}
        {projects.map((project) => (
          <ProjectListEntry key={project.id} project={project} />
        ))}
      </div>
      <LazyLoader
        hasMore={hasMore}
        pageSize={pageSize}
        onInvalidate={revalidateBrainstorms}
      />
    </>
  )
}
