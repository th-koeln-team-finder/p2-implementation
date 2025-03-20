import { authMiddleware } from '@/auth'
import { getApplicationsForUser } from '@/features/Application/applications.queries'
import RetractApplicationButton from '@/features/Application/components/RetractApplicationButton'
import { Link, redirect } from '@/features/i18n/routing'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { getLocale, getTranslations } from 'next-intl/server'

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
      <h1 className="mb-8 font-semibold text-4xl">{translate('title')}</h1>

      <h2 className="mb-4 font-bold text-2xl">{translate('invitations')}</h2>

      {invitations.length === 0 && (
        <div className="text-muted-foreground italic">
          {translate('emptyInvitations')}
        </div>
      )}

      <hr className="my-8 " />

      <h2 className="mb-4 font-bold text-2xl">{translate('applications')}</h2>

      {applications.length === 0 && (
        <div className="text-muted-foreground italic">
          {translate('emptyApplications')}
        </div>
      )}
      {applications?.map((app) => (
        <div key={app.id} className="flex w-full flex-row gap-4 border-b py-4">
          <div className="flex grow flex-col">
            <span className="mb-1 text-muted-foreground text-sm italic">
              {app.createdAt && dateFormatter.format(app.createdAt)}
            </span>
            <Link
              className="mb-2 font-bold hover:underline"
              href={`/projects/${app.projectId}`}
            >
              {translate('projectName', { name: app.project.name })}
            </Link>
            <Link
              className="line-clamp-3 overflow-hidden border-l-4 bg-muted p-4 italic hover:bg-muted/70"
              href={`/communication-dashboard/application/${app.id}`}
            >
              {app.message && (
                <WysiwygRenderer value={app.message} renderAsString />
              )}
            </Link>
          </div>

          <div className="flex flex-1 flex-col items-end justify-center gap-2">
            <RetractApplicationButton applicationId={app.id} />
          </div>
        </div>
      ))}
    </main>
  )
}
