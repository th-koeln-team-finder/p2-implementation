import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { LazyLoader } from '@/features/general/components/LazyLoader'
import { ProjectListEntry } from '@/features/projects/components/ProjectListEntry'
import { getProjectItems } from '@/features/projects/projects.queries'
import { getTranslations } from 'next-intl/server'

type ProjectListProps = {
  search?: string
  offset?: string
}

const pageSize = 15

export async function ProjectList({ search, offset }: ProjectListProps) {
  const translate = await getTranslations('projects')
  const offsetNumber = Number.parseInt(offset ?? '0')
  const limit = pageSize + offsetNumber
  const projects = await getProjectItems(search, limit)
  const hasMore = limit <= projects.length

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {!projects.length && (
          <p className="col-span-3 my-3 text-center text-muted-foreground italic">
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
