import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { getSingleBrainstorm } from '@/features/brainstorm/brainstorm.queries'
import { getCommentsForBrainstorm } from '@/features/brainstorm/brainstormComment.queries'
import { BrainstormLinksResources } from '@/features/brainstorm/components/brainstorm-details/BrainstormLinksResources'
import { BrainstormTagList } from '@/features/brainstorm/components/brainstorm-details/BrainstormTagList'
import { BrainstormComments } from '@/features/brainstorm/components/brainstorm-details/comments/BrainstormComments'
import { Link, redirect } from '@/features/i18n/routing'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  Button,
  buttonVariants,
} from '@repo/design-system/components/ui/button'
import {
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog'
import { Label } from '@repo/design-system/components/ui/label'
import { cn } from '@repo/design-system/lib/utils'
import {
  BookmarkIcon,
  ChevronLeftIcon,
  FolderPlusIcon,
  LinkIcon,
} from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

type BrainstormDetailsProps = {
  brainstormId: string
  className?: string
  hideHeader?: boolean
}

export async function BrainstormDialogHeader({
  brainstormId,
}: { brainstormId: string }) {
  const brainstorm = await getSingleBrainstorm(brainstormId)
  const translate = await getTranslations('brainstorm')
  if (!brainstorm) return null
  return (
    <DialogHeader className="pr-4">
      <div className="flex flex-row items-center justify-between gap-2">
        <DialogTitle className="font-head font-medium text-3xl">
          {brainstorm.title}
        </DialogTitle>
        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" type="button">
            <LinkIcon />
          </Button>
          <Button variant="ghost" size="icon" type="button">
            <BookmarkIcon />
          </Button>
          <Button type="button" size="sm">
            <FolderPlusIcon />
            {translate('makeActionButton')}
          </Button>
        </div>
      </div>
      <BrainstormTagList tags={brainstorm.tags} />
    </DialogHeader>
  )
}

export async function BrainstormDetails({
  brainstormId,
  hideHeader,
  className,
}: BrainstormDetailsProps) {
  const [locale, translate, brainstorm, brainstormComments] = await Promise.all(
    [
      getLocale(),
      getTranslations('brainstorm'),
      getSingleBrainstorm(brainstormId),
      getCommentsForBrainstorm(brainstormId),
    ],
  )
  if (!brainstorm) {
    return redirect({
      locale,
      href: '/brainstorm',
    })
  }
  return (
    <section
      className={cn(
        '-mr-3 mt-4 flex flex-col gap-2 overflow-auto pr-3 pb-4',
        className,
      )}
    >
      {!hideHeader && (
        <>
          <nav className="sticky top-0 z-10 flex flex-row justify-between bg-card py-1 ring ring-card">
            <div className="flex flex-row gap-2">
              <Link
                locale={locale}
                href="/brainstorm"
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                  className: '[&_svg]:size-6',
                })}
              >
                <ChevronLeftIcon />
              </Link>
              <div>
                <h1 className="font-head font-medium text-3xl">
                  {brainstorm.title}
                </h1>
                <p className="inline-flex flex-row items-center gap-2 text-muted-foreground text-sm">
                  <UserAvatar
                    user={brainstorm.creator}
                    className="h-6 w-6"
                    fallbackClassName="text-xs"
                  />
                  {brainstorm.creator.name}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              {/* TODO implement bookmarks */}
              <Button variant="ghost" size="icon" type="button">
                <BookmarkIcon />
              </Button>
              <Button type="button" size="sm">
                <FolderPlusIcon />
                {translate('makeActionButton')}
              </Button>
            </div>
          </nav>
          <BrainstormTagList tags={brainstorm.tags} />
        </>
      )}
      {brainstorm.description && (
        <WysiwygRenderer value={brainstorm.description} />
      )}
      <div className="grid min-h-96 place-items-center rounded border border-border" />
      <div>
        <Label>{translate('headingResources')}</Label>
        <BrainstormLinksResources
          links={[
            { href: 'https://usefullinks.com' },
            { href: 'www.scrum.org', label: 'Scrum Guide' },
          ]}
        />
      </div>
      <BrainstormComments
        brainstormId={brainstormId}
        comments={brainstormComments}
      />
    </section>
  )
}
