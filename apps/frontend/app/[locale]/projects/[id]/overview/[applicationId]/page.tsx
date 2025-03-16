import {getApplication} from "@/features/Application/applications.queries";
import {Link} from "@/features/i18n/routing";
import {UserAvatar} from "@/features/auth/components/UserAvatar";
import {WysiwygRenderer} from "@repo/design-system/components/WysiwygEditor/WysiwygRenderer";

export default async function Overview({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>
}) {
  const { id, applicationId } = await params
  const app = await getApplication(applicationId)

  if (!app) {
    return <div>Application not found</div>
  }
  return (
    <div className="container mx-auto px-4">
      <div key={app.id} className="flex w-full flex-row gap-2 px-2 py-4">
        <div>
          <Link href={`/projects/${id}/overview/${app.id}`}>
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
        </div>
      </div>
    </div>
  )
}
