import { authMiddleware } from '@/auth'
import ApplicationDetail from '@/features/Application/components/ApplicationDetails'
import { hasSessionPermission } from '@/features/auth/auth.utils'
import { redirect } from '@/features/i18n/routing'
import { getProjectItem } from '@/features/projects/projects.queries'
import { getLocale } from 'next-intl/server'

export default async function Invite({
                                              params,
                                          }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const locale = await getLocale()
    const session = await authMiddleware()
    const project = await getProjectItem(id, session?.user?.id)
    if (!project) {
        return redirect({
            href: `/project/${id}`,
            locale,
        })
    }

    const canCreateApplication = await hasSessionPermission(
        'applyProject',
        'create',
        { createdById: project.createdBy },
    )
    if (!canCreateApplication) {
        return redirect({
            locale,
            href: `/projects/${id}`,
        })
    }

    return (
        <div className="container mx-auto px-4">
            <ApplicationDetail userId={id} />
        </div>
    )
}
