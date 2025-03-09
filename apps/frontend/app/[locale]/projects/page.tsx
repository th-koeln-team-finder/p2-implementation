 import { ProjectFilterBar } from '@/features/projects/components/FilterBar/ProjectFilterBar'
import type { FilterSearchParams } from '@/features/projects/components/FilterBar/filterbar.constants'
import { ProjectList } from '@/features/projects/components/ProjectList'
import { getTranslations } from 'next-intl/server'

export default async function Projects({
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

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 font-semibold text-4xl">{translate('pageTitle')}</h1>
      <ProjectFilterBar />
      <ProjectList offset={offset} search={search} filters={filters} />
    </div>
  )
}
