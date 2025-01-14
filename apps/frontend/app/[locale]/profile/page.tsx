import { authMiddleware } from '@/auth'
import { Link } from '@/features/i18n/routing'
import PreviouslyWorkedOn from '@/features/users/components/PreviouslyWorkedOn'
import Ratings from '@/features/users/components/Ratings'
import type { UserSelect } from '@repo/database/schema'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar'
import { Button } from '@repo/design-system/components/ui/button'
import { UserPen } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const translate = await getTranslations()
  const session = await authMiddleware()

  if (!session) {
    return <div>Not logged in</div>
  }

  const user = session.user as UserSelect

  const lastActivity = new Date()

  return (
    <main className="container mx-auto my-4">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="md:w-1/4">
          <Avatar className="h-40 w-40">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name ?? user.email ?? ''}
              />
            )}
            <AvatarFallback>
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'AN'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 flex-col space-y-1">
          <p className="font-bold text-xs">Developer/Student</p>
          <div className="flex items-center gap-4">
            <h1 className="inline font-bold text-3xl">{user.name}</h1>
            <Link href="/edit-profile">
              <Button>
                <UserPen />
                {translate('users.editProfile')}
              </Button>
            </Link>
            <Ratings />
          </div>
          <p className="text-muted-foreground text-xs leading-none">
            {translate('users.lastActivity')}:{' '}
            {lastActivity.toLocaleDateString()}
          </p>
          <p className="text-sm">{user.bio}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 font-bold text-2xl">{translate('users.skills')}</h2>
        <div className="grid grid-rows-3 text-sm">
          <div className="my-2 flex max-w-md items-center gap-2">
            <p className="flex-1">JavaScript</p>
            <div className="flex flex-1 gap-2">
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary-foreground'} />
            </div>
          </div>
          <div className="my-2 flex max-w-md items-center gap-2">
            <p className="flex-1">React</p>
            <div className="flex flex-1 gap-2">
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary-foreground'} />
              <div className={'h-1 w-1 rounded-full bg-primary-foreground'} />
            </div>
          </div>
          <div className="my-2 flex max-w-md items-center gap-2">
            <p className="flex-1">TypeScript</p>
            <div className="flex flex-1 gap-2">
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
              <div className={'h-1 w-1 rounded-full bg-primary'} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 font-bold text-2xl">
          {translate('users.previouslyWorkedOn')}
        </h2>
        <PreviouslyWorkedOn
          loadMoreProjectsText={translate('users.loadMoreProjects')}
        />
      </div>
    </main>
  )
}
