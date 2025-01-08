import { authMiddleware } from '@/auth'
import { SignOutMenuItem } from '@/features/auth/components/SignOutMenuItem'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { Button } from '@repo/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import type { PropsWithChildren } from 'react'

export async function UserProfileMenu({ children }: PropsWithChildren) {
  const session = await authMiddleware()

  if (!session?.user) return null
  return (
    <div className="flex flex-row items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <UserAvatar user={session.user} className="h-10 w-10" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {children}
          {children && <DropdownMenuSeparator />}
          <SignOutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
