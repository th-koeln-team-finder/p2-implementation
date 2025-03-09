import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/design-system/components/ui/sidebar'
import { Link } from '@/features/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { authMiddleware } from '@/auth'
import { getUserWithImage } from '@/features/users/users.query'
import { ApplicationIcon } from '@/features/general/components/ApplicationIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import {
  BellIcon,
  BrainCircuitIcon,
  ChevronsUpDownIcon,
  SettingsIcon,
  Users2Icon,
} from 'lucide-react'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { SignOutMenuItem } from '@/features/auth/components/SignOutMenuItem'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'

export async function AppSidebar() {
  const [translate, session] = await Promise.all([
    getTranslations('header'),
    authMiddleware(),
  ])

  const user = session?.user
    ? await getUserWithImage(session?.user.id)
    : undefined

  return (
    <Sidebar side="right" hideOnDesktop>
      <SidebarHeader className="flex flex-row items-center gap-2 pt-4">
        <ApplicationIcon className="size-10" />
        <h1 className="text-2xl">Collaborize</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton hideOnClick>
                <Link href="/projects">{translate('linkProjectList')}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton hideOnClick>
                <Link href="/projects/create">
                  {translate('linkProjectCreate')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton hideOnClick>
                <Link href="/brainstorm">{translate('linkBrainstorm')}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!user && (
            <SidebarMenuItem className="mx-auto flex flex-row items-center gap-2">
              <LoginButton />
              <RegisterButton />
            </SidebarMenuItem>
          )}
          {user && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <UserAvatar user={user} />
                    <div className="flex flex-col items-start gap-1 text-sm leading-tight">
                      <p className="font-medium text-sm leading-none">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.email}
                      </p>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem>
                    <Users2Icon /> {translate('settingLinkMyProjects')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BrainCircuitIcon /> {translate('settingLinkMyBrainstorms')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BellIcon /> {translate('settingLinkNotifications')}
                  </DropdownMenuItem>
                  <Link href="/edit-profile/profile">
                    <DropdownMenuItem>
                      <SettingsIcon /> {translate('settingLinkSettings')}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <SignOutMenuItem />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
