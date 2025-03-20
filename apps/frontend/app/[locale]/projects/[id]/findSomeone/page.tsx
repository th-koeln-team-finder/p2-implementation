

import {getTranslations} from 'next-intl/server'
import { FindSomeoneList } from '@/features/projects/components/FindSomeone/FindSomeoneList'

export default async function FindSomeone({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    search: string
    offset: string
  }>
}) {
  const { id: projectId } = await params
  const { search, offset } = await searchParams
  const translate = await getTranslations('findSomeone')
  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 font-semibold text-4xl">{translate('pageTitle')}</h1>
      <FindSomeoneList search={search} projectId={projectId} offset={offset} />
    </div>
  )
}
