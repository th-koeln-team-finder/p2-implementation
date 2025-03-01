import { authMiddleware } from '@/auth'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu'
import { ApplicationIcon } from '@/features/general/components/ApplicationIcon'
import { Link } from '@/features/i18n/routing'
import { getUser } from '@/features/users/users.query'
import type { UserWithImage } from '@/features/users/users.types'
import { Button } from '@repo/design-system/components/ui/button'
import { DropdownMenuItem } from '@repo/design-system/components/ui/dropdown-menu'
import { Input } from '@repo/design-system/components/ui/input'
import {
  BellIcon,
  BrainCircuitIcon,
  SearchIcon,
  SettingsIcon,
  Users2Icon,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const [translsate, session] = await Promise.all([
    getTranslations('header'),
    authMiddleware(),
  ])

  const user = session?.user
    ? ((await getUser(session?.user.id)) as UserWithImage)
    : undefined

  return (
    <header className="header flex w-full self-stretch px-4 py-2">
      <a href="/">
        <ApplicationIcon className="size-16" />
      </a>

      <div className="flex w-full items-center justify-end gap-12 self-stretch">
        <div className="relative">
          <Input
            className="min-w-72 pl-8"
            type="search"
            placeholder={translsate('placeholderSearchEverywhere')}
          />
          <div className="pointer-events-none absolute top-0 bottom-0 left-2 flex flex-row items-center">
            <SearchIcon className="size-5 text-muted-foreground" />
          </div>
        </div>

        <nav className="nav flex items-center gap-6">
          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/projects">{translsate('linkProjectList')}</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/projects/create">
              {translsate('linkProjectCreate')}
            </Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/brainstorm">{translsate('linkBrainstorm')}</Link>
          </Button>

          {user ? (
            <UserProfileMenu>
              <DropdownMenuItem>
                <Users2Icon /> {translsate('settingLinkMyProjects')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BrainCircuitIcon /> {translsate('settingLinkMyBrainstorms')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon /> {translsate('settingLinkNotifications')}
              </DropdownMenuItem>
              <Link href="/edit-profile/profile">
                <DropdownMenuItem>
                  <SettingsIcon /> {translsate('settingLinkSettings')}
                </DropdownMenuItem>
              </Link>
            </UserProfileMenu>
          ) : (
            <>
              <LoginButton />
              <RegisterButton />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
