import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { LazyLoader } from '@/features/general/components/LazyLoader'
import type { FilterSearchParams } from '@/features/projects/components/FilterBar/filterbar.constants'
import { parseFilters } from '@/features/projects/components/FilterBar/filterbar.utils'
import { ProjectListEntry } from '@/features/projects/components/ProjectListEntry'
import {
  getProjectItems,
  getProjectItemsByCreatorId,
} from '@/features/projects/projects.queries'
import { getTranslations } from 'next-intl/server'

type ProjectListProps = {
  search?: string
  offset?: string
  filters: FilterSearchParams
  createdById?: string
}

const pageSize = 15

export async function ProjectList({
  search,
  offset,
  filters,
  createdById,
}: ProjectListProps) {
  const translate = await getTranslations('projects')

  const parsedFilters = parseFilters(filters)

  const offsetNumber = Number.parseInt(offset ?? '0')
  const limit = pageSize + offsetNumber
  const projects = createdById
    ? await getProjectItemsByCreatorId(
        createdById,
        search,
        parsedFilters,
        limit,
      )
    : await getProjectItems(search, parsedFilters, limit)
  const hasMore = limit <= projects.length

  return (
    <>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
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
