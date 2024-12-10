import { authMiddleware } from '@/auth'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { DropdownMenuItem } from '@repo/design-system/components/ui/dropdown-menu'
import {LockIcon, UserIcon} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function UnauthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await authMiddleware()
  const translate = await getTranslations()
  return (
    <>
      <nav className="flex h-16 flex-row justify-end gap-2 bg-card p-4">
        {session?.user ? (
          <UserProfileMenu>
            <Link href="/admin">
              <DropdownMenuItem className="cursor-pointer">
                <LockIcon />
                Admin
              </DropdownMenuItem>
            </Link>
          </UserProfileMenu>
        ) : (
          <>
            <LoginButton />
            <Link href="/register">
              <Button>{translate('auth.register.button')}</Button>
            </Link>
          </>
        )}
      </nav>
      {children}
    </>
  )
}
