'use client'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { ApplicationIcon } from '@/features/general/components/ApplicationIcon'
import { Link } from '@/features/i18n/routing'
import type { UserWithImage } from '@/features/users/users.types'
import { Button } from '@repo/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import { Input } from '@repo/design-system/components/ui/input'
import {
  BellIcon,
  BrainCircuitIcon,
  SearchIcon,
  SettingsIcon,
  Users2Icon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header({ user }: { user: UserWithImage | undefined }) {
  const [_isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const html = document.querySelector('html')
    if (html?.classList.contains('dark')) {
      setIsDarkMode(true)
    }
  }, [])

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
            placeholder={'Search everywhere...'}
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
            <Link href="/projects">Find a Project</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/projects/create">Create a Project</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/brainstorm">Brainstorm</Link>
          </Button>

          {/* //TODO Anmelden und Registrieren Buttons & weitere Account etc. verlinken */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus-visible:outline-none">
              <UserAvatar user={user} className="h-10 w-10" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user && (
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <Link href="/profile" className="hover:underline">
                      <p className="font-medium text-sm leading-none">
                        {user.name}
                      </p>
                    </Link>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              )}
              {user && <DropdownMenuSeparator />}
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <Users2Icon /> My Projects
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <BrainCircuitIcon /> My Brainstorms
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <BellIcon /> Notifications
              </DropdownMenuItem>
              <Link href="/edit-profile">
                <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                  <SettingsIcon /> Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
