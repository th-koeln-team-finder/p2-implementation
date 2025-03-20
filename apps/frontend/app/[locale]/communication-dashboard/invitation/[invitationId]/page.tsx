import { NavigationModal } from '@/features/general/components/NavigationModal'
import { Link, redirect } from '@/features/i18n/routing'
import ManageInvitationButton from '@/features/invitation/components/ManageInvitationButtons'
import { getInvitation } from '@/features/invitation/invitations.queries'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  DialogContent,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog'
import { getFormatter, getLocale, getTranslations } from 'next-intl/server'

export default async function Detail({
  params,
}: {
  params: Promise<{ invitationId: string }>
}) {
  const { invitationId } = await params
  const invitation = await getInvitation(invitationId)
  if (!invitation) {
    const locale = await getLocale()
    return redirect({
      href: '/communication-dashboard',
      locale,
    })
  }

  const format = await getFormatter()

  const translate = await getTranslations('invitations')
  const project = invitation.project

  const title = translate('title', {
    name: project.name,
  })

  return (
    <NavigationModal>
      <DialogContent className="top-[25%] flex min-w-full flex-col gap-4 sm:min-w-0 sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <div className="flex items-center justify-between border-b-2 px-2 py-4">
          <div className="flex flex-grow flex-col gap-1">
            {invitation.createdAt && (
              <div className="text-muted-foreground text-xs">
                {format.dateTime(invitation.createdAt, { dateStyle: 'long' })}
              </div>
            )}
            <Link href={`/projects/${project.id}`} className="hover:underline">
              <DialogTitle>{title}</DialogTitle>
            </Link>
          </div>
          <ManageInvitationButton
            className="flex flex-col gap-2"
            projectId={project.id}
            invitationId={invitation.id}
          />
        </div>
        <div className="">
          <WysiwygRenderer value={invitation.message} renderAsString />
        </div>
      </DialogContent>
    </NavigationModal>
  )
}
