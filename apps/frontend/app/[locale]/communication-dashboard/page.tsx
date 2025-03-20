import {authMiddleware} from "@/auth";
import {Link, redirect} from "@/features/i18n/routing";
import {getLocale, getTranslations} from "next-intl/server";
import {getApplicationsForUser} from "@/features/Application/applications.queries";
import {WysiwygRenderer} from "@repo/design-system/components/WysiwygEditor/WysiwygRenderer";
import RetractApplicationButton from "@/features/Application/components/RetractApplicationButton";

export default async function CommunicationDashboard() {
  const session = await authMiddleware()
  const locale = await getLocale()

  if (!session?.user?.id) {
    return redirect({
      href: '/',
      locale,
    })
  }
  const translate = await getTranslations('communicationDashboard')
  const applications = await getApplicationsForUser(session.user.id)
  const invitations = []
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="container mx-auto my-4 px-4">
      <h1 className="mb-8 font-semibold text-4xl">
        {translate('title')}
      </h1>

      <h2 className="mb-4 font-bold text-2xl">{translate('invitations')}</h2>

      {invitations.length === 0 && (
        <div className="text-muted-foreground italic">
          {translate('emptyInvitations')}
        </div>
      )}

      <hr className="my-8 "/>

      <h2 className="mb-4 font-bold text-2xl">{translate('applications')}</h2>

      {applications.length === 0 && (
        <div className="text-muted-foreground italic">
          {translate('emptyApplications')}
        </div>
      )}
      {applications?.map((app) => (
        <div
          key={app.id}
          className="flex w-full flex-row gap-4 border-b py-4"
        >
          <div className="flex grow flex-col">
            <span
              className="text-sm text-muted-foreground italic mb-1">{app.createdAt && dateFormatter.format(app.createdAt)}</span>
            <Link
              className="font-bold hover:underline mb-2"
              href={`/projects/${app.projectId}`}
            >
              {translate('projectName', {name: app.project.name})}
            </Link>
            <Link
              className="line-clamp-3 border-l-4 p-4 bg-muted overflow-hidden italic hover:bg-muted/70"
              href={`/communication-dashboard/application/${app.id}`}
            >
              {app.message && (
                <WysiwygRenderer value={app.message} renderAsString/>
              )}
            </Link>
          </div>

          <div className="flex flex-col flex-1 items-end gap-2 justify-center">
            <RetractApplicationButton applicationId={app.id}/>
          </div>
        </div>
      ))}
    </main>
  )
}