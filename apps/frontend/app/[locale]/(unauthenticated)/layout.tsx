import { authMiddleware } from '@/auth'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu'
import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { getTranslations } from 'next-intl/server'

export default async function UnauthenticatedLayout({
  children,
  modals,
}: Readonly<{
  children: React.ReactNode
  modals: React.ReactNode
}>) {
  const session = await authMiddleware()
  const translate = await getTranslations()
  return (
    <>
      <nav className="flex h-16 flex-row justify-end gap-2 bg-card p-4">
        {session?.user ? (
          <UserProfileMenu />
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
      {modals}
    </>
  )
}
