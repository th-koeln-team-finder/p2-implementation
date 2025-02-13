'use client'
import { ApplicationIcon } from '@/features/general/components/ApplicationIcon'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import { Input } from '@repo/design-system/components/ui/input'
import {
  BellIcon,
  BrainCircuitIcon,
  SearchIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Header() {
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
              <Image
                className="h-8 w-8 rounded-full"
                src="/images/image-placeholder-square.jpg"
                height={800}
                width={1200}
                alt="placeholder"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <User2Icon /> Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <Users2Icon /> My Projects
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <BrainCircuitIcon /> My Brainstorms
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <BellIcon /> Notifications
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <SettingsIcon /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
