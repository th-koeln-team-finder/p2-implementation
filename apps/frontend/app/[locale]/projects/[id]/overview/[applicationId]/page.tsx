import { getApplication } from '@/features/Application/applications.queries'
import ApplicationListPin from '@/features/Application/components/ApplicationListPin'
import ManageApplicationButton from '@/features/Application/components/ManageApplicationButton'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { getPublicFileUrl } from '@/features/file-upload/file-upload.actions'
import { NavigationModal } from '@/features/general/components/NavigationModal'
import { Link, redirect } from '@/features/i18n/routing'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import FileInlineListCards from '@repo/design-system/components/custom/file-inline-list-cards'
import {
  DialogContent,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog'
import { getFormatter, getLocale, getTranslations } from 'next-intl/server'

export default async function Overview({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>
}) {
  const { id, applicationId } = await params
  const app = await getApplication(applicationId)
  if (!app) {
    return null
  }

  const format = await getFormatter()

  const translate = await getTranslations('projects.application')
  const files = await Promise.all(
    app.files.map(async (file) => {
      return {
        key: file.file.id,
        type: file.file.fileType,
        name: file.file.bucketPath.split('/').pop() || 'unnamed',
        downloadLink: (await getPublicFileUrl(file.file.bucketPath))[1],
      }
    }),
  )

  const title = translate('title', {
    name:
      !!app.user.firstName || !!app.user.lastName
        ? `${app.user.firstName} ${app.user.lastName}`
        : app.user.name,
  })

  if (!app) {
    const locale = await getLocale()
    return redirect({
      href: `/project/${id}/overview`,
      locale,
    })
  }
  return (
    <NavigationModal>
      <DialogContent className="flex min-w-full flex-col gap-4 sm:min-w-0 sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <div className="flex w-full flex-row gap-4 border-b-2 px-2 py-4">
          <Link href={`/profile/${app.user.id}`}>
            <div className="w-2/12">
              <UserAvatar
                user={app.user}
                className="h-16 w-16 rounded-full object-cover lg:h-24 lg:w-24"
              />
            </div>
          </Link>
          <div className="flex w-9/12 flex-col gap-1">
            {app.createdAt && (
              <div className="text-muted-foreground text-xs">
                {format.dateTime(app.createdAt, { dateStyle: 'long' })}
              </div>
            )}
            <DialogTitle>{title}</DialogTitle>
            <div className="text-muted-foreground">{app.user.email}</div>
          </div>
          <div className="flex gap-4">
            <ApplicationListPin application={app} />
            <ManageApplicationButton
              project={app.project}
              applicationId={app.id}
            />
          </div>
        </div>
        <div className="">
          <FileInlineListCards files={files} />
        </div>
        <div className="">
          <WysiwygRenderer value={app.message} renderAsString />
        </div>
      </DialogContent>
    </NavigationModal>
  )
}
