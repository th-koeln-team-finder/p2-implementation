import ApplicationDetail from '@/features/Application/components/ApplicationDetails'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/features/i18n/routing'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import {authMiddleware} from "@/auth";
import {getProjectItem} from "@/features/projects/projects.queries";

export default async function Application({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = await getLocale()
  const session = await authMiddleware()
  const project = await getProjectItem(id, session?.user?.id)
  if (!project) {
    return <div>Project not found</div>
  }

  const canCreateApplication = await hasSessionPermission(
    'applyProject',
    'create',
    {createdById: project.createdBy}
  )
  if (!canCreateApplication) {
    return redirect({
      locale,
      href: `/projects/${id}`,
    })
  }

  return (
    <div className="container mx-auto px-4">
      <ApplicationDetail projectId={id} />
    </div>
  )
}
