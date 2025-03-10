import { authMiddleware } from '@/auth'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu'
import { ApplicationIcon } from '@/features/general/components/ApplicationIcon'
import { Link } from '@/features/i18n/routing'
import { getUserWithImage } from '@/features/users/users.query'
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
  const [translate, session] = await Promise.all([
    getTranslations('header'),
    authMiddleware(),
  ])

  const user = session?.user
    ? await getUserWithImage(session?.user.id)
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
            placeholder={translate('placeholderSearchEverywhere')}
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
            <Link href="/projects">{translate('linkProjectList')}</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/projects/create">
              {translate('linkProjectCreate')}
            </Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/brainstorm">{translate('linkBrainstorm')}</Link>
          </Button>

          {user ? (
            <UserProfileMenu>
              <Link href="/my-projects">
                <DropdownMenuItem>
                  <Users2Icon /> {translate('settingLinkMyProjects')}
                </DropdownMenuItem>
              </Link>
              <Link href="/my-brainstorms">
                <DropdownMenuItem>
                  <BrainCircuitIcon /> {translate('settingLinkMyBrainstorms')}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <BellIcon /> {translate('settingLinkNotifications')}
              </DropdownMenuItem>
              <Link href="/edit-profile/profile">
                <DropdownMenuItem>
                  <SettingsIcon /> {translate('settingLinkSettings')}
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
