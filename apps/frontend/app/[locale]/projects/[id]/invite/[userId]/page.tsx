import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import InvitationDetail from '@/features/invitation/components/InvitationDetails'
import { getProjectItem } from '@/features/projects/projects.queries'
import { getUserWithImage } from '@/features/users/users.query'
import { getLocale } from 'next-intl/server'

export default async function Invite({
  params,
}: {
  params: Promise<{ id: string; userId: string }>
}) {
  const { id, userId } = await params
  const locale = await getLocale()
  const session = await authMiddleware()
  const project = await getProjectItem(id, session?.user?.id)
  const user = await getUserWithImage(userId)
  if (!project || !user) {
    return redirect({
      href: `/projects/${id}`,
      locale,
    })
  }
  return (
    <div className="container mx-auto px-4">
      <InvitationDetail user={user} projectId={id} />
    </div>
  )
}
