import { authMiddleware } from '@/auth'
import { SignOutMenuItem } from '@/features/auth/components/SignOutMenuItem'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { Link } from '@/features/i18n/routing'
import { getUser } from '@/features/users/users.query'
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
  const user = await getUser(session.user.id)
  return (
    <div className="flex flex-row items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <UserAvatar user={user} className="h-10 w-10" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <Link href="/profile" className="hover:underline">
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
          </Link>
          <DropdownMenuSeparator />
          {children}
          {children && <DropdownMenuSeparator />}
          <SignOutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
