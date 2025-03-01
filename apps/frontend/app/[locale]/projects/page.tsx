import { ProjectFilterBar } from '@/features/projects/components/ProjectFilterBar'
import { ProjectList } from '@/features/projects/components/ProjectList'
import { getTranslations } from 'next-intl/server'

const _pageSize = 15

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{
    search: string
    offset: string
  }>
}) {
  const [translate, { search, offset }] = await Promise.all([
    getTranslations('projects'),
    searchParams,
  ])

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 font-semibold text-4xl">{translate('pageTitle')}</h1>
      <ProjectFilterBar />
      <ProjectList offset={offset} search={search} />
    </div>
  )
}
