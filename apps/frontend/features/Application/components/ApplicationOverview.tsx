import { EyeIcon, StarIcon, TextIcon, UserPlusIcon } from 'lucide-react'

import { authMiddleware } from '@/auth'
import { getApplicationsForProject } from '@/features/Application/applications.queries'
import { ApplicationList } from '@/features/Application/components/ApplicationList'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { Link, redirect } from '@/features/i18n/routing'
import { getProjectItem } from '@/features/projects/projects.queries'
import { Button } from '@repo/design-system/components/ui/button'
import { getLocale, getTranslations } from 'next-intl/server'

type ApplicationDetailProps = {
  projectId: string
}

export default async function ApplicationOverview({
  projectId,
}: ApplicationDetailProps) {
  const session = await authMiddleware()
  const [locale, translate, project, applications] = await Promise.all([
    getLocale(),
    getTranslations(),
    getProjectItem(projectId, session?.user?.id),
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
    <div className="container mx-auto px-4">
      <h2 className="mb-4 font-bold text-2xl">{project.name}</h2>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3 flex flex-col items-center sm:col-span-2">
          <EyeIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            {translate('projects.overview.impressionsCount', {
              count: project.impressionCount,
            })}
          </div>
        </div>
        <div className="col-span-3 flex flex-col items-center sm:col-span-2">
          <TextIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            {translate('projects.overview.applicationsCount', {
              count: applications.length,
            })}
          </div>
        </div>
        <div className="col-span-6 flex flex-col items-center sm:col-span-2">
          <StarIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            {translate('projects.overview.likesCount', {
              count: project.starCount,
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-xl">
          {translate('projects.overview.applicationTitle')}
        </h2>
        <Link
          href={`/projects/${projectId}/findSomeone`}
          className="ml-auto sm:ml-0"
        >
          <Button>
            <UserPlusIcon />
            Find Someone
          </Button>
        </Link>
      </div>

      <ApplicationList projectId={projectId} />
    </div>
  )
}
