import {getApplicationsForProject} from '@/features/Application/applications.queries'
import {MailsIcon, PaperclipIcon} from 'lucide-react'
import {Button} from '@repo/design-system/components/ui/button'
import {UserAvatar} from '@/features/auth/components/UserAvatar'
import {WysiwygRenderer} from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {Link} from '@/features/i18n/routing'
import {authMiddleware} from "@/auth";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@repo/design-system/components/ui/tooltip";
import {getTranslations} from "next-intl/server";
import ApplicationListPin from "@/features/Application/components/ApplicationListPin";

type ApplicationListProps = {
  projectId: string
}

export async function ApplicationList({projectId}: ApplicationListProps) {
  const translate = await getTranslations('projects.overview')
  const session = await authMiddleware()
  const application = await getApplicationsForProject(projectId, session?.user?.id)

  return (
    <div>
      {application.length === 0 && (
        <div className="border-t-2 px-2 py-4 text-muted-foreground italic">
          {translate('noApplications')}
        </div>
      )}

      {application?.map((app) => (
        <div
          key={app.id}
          className="flex w-full flex-row gap-4 border-t-2 border-b-2 px-2 py-4"
        >
          <Link href={`/projects/${projectId}/overview/${app.id}`}>
            <div className="size-14 lg:size-24">
              <UserAvatar
                user={app.user}
                className="h-12 w-12 rounded-full object-cover lg:h-24 lg:w-24"
              />
            </div>
          </Link>

          <Link
            className="flex flex-col grow"
            href={`/projects/${projectId}/overview/${app.id}`}
          >
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
                <WysiwygRenderer value={app.message} renderAsString/>
              )}
            </div>
          </Link>

          <div className="flex size-20 gap-2 flex-row">
            {app.attachmentCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    className={
                      'inline-flex h-9 items-center p-0 [&_svg]:size-4 [&_svg]:shrink-0'
                    }
                  >
                    <PaperclipIcon/>
                  </TooltipTrigger>
                  <TooltipContent>
                    {translate('filesAttached', {count: app.attachmentCount})}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <ApplicationListPin application={app}/>
            <Button variant="ghost" className="w-full p-0">
              <MailsIcon size={24}/>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
