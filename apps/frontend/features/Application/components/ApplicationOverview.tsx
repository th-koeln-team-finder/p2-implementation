import { EyeIcon, StarIcon, TextIcon } from 'lucide-react'

import { getApplicationsForProject } from '@/features/Application/applications.queries'
import { ApplicationList } from '@/features/Application/components/ApplicationList'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import { getProjectItem } from '@/features/projects/projects.queries'
import { getLocale, getTranslations } from 'next-intl/server'

type ApplicationDetailProps = {
  projectId: string
}

export default async function ApplicationOverview({
  projectId,
}: ApplicationDetailProps) {
  const [locale, translate, project, applications] = await Promise.all([
    getLocale(),
    getTranslations(),
    getProjectItem(projectId),
    getApplicationsForProject(projectId),
  ])

  if (!project) {
    return <div>{translate('projects.overview.notFound')}</div>
  }

  if (
    !(await hasSessionPermission('projectApplication', 'view', {
      createdById: project.createdBy,
    }))
  ) {
    return redirect({
      href: `/projects/${projectId}`,
      locale,
    })
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <div className="mb-16 font-bold text-xl">
        {translate('projects.overview.title')} - {project.name}
      </div>

      <div className="mb-16 flex w-full flex-row gap-4">
        <div className="flex w-1/3 flex-col items-center">
          <EyeIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            {/*TODO: add functionality */}
            {translate('projects.overview.impressionsCount', { count: 182 })}
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <TextIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            {translate('projects.overview.applicationsCount', {
              count: applications.length,
            })}
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <StarIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            {/*TODO: add functionality */}
            {translate('projects.overview.likesCount', { count: 1045 })}
          </div>
        </div>
      </div>

      <ApplicationList projectId={projectId} />
    </div>
  )
}
