import { getApplicationsForProject } from '@/features/Application/applications.queries'
import { MailsIcon, PaperclipIcon, PinIcon } from 'lucide-react'
import { Button } from '@repo/design-system/components/ui/button'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { Link } from '@/features/i18n/routing'

type ApplicationListProps = {
  projectId: string
}

export async function ApplicationList({ projectId }: ApplicationListProps) {
  const application = await getApplicationsForProject(projectId)
  return (
    <div>
      {application.map((app) => (
        <div
          key={app.id}
          className="flex w-full flex-row gap-2 border-t-2 border-b-2 px-2 py-4"
        >
          <Link href={`/projects/${projectId}/overview/${app.id}`}>
            <div className="w-2/12">
              <UserAvatar
                user={app.user}
                className="h-12 w-12 rounded-full object-cover lg:h-24 lg:w-24"
              />
            </div>
          </Link>

          <div className="flex w-9/12 flex-col">
            <div className="mb-2 font-bold text-lg">
              {app.user.firstName} {app.user.lastName}
              {!!app.user.firstName || !!app.user.lastName ? (
                <span className="ml-4 text-muted-foreground text-sm">
                  {app.user.name}
                </span>
              ) : (
                app.user.name
              )}
            </div>

            <div className="max-h-10 overflow-hidden">
              {app.message && (
                <WysiwygRenderer value={app.message} renderAsString />
              )}
            </div>
          </div>

          <div className="flex w-1/12 flex-col gap-2 lg:flex-row">
            <div
              className={
                'inline-flex h-9 items-center p-0 [&_svg]:size-4 [&_svg]:shrink-0'
              }
            >
              <PaperclipIcon />
            </div>
            <Button variant="ghost" className="w-full p-0">
              <PinIcon size={24} />
            </Button>
            <Button variant="ghost" className="w-full p-0">
              <MailsIcon size={24} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
