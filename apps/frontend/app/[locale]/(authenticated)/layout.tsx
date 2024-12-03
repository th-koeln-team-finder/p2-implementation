import { authMiddleware } from '@/auth'
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu'
import { redirect } from '@/features/i18n/routing'
import { getLocale } from 'next-intl/server'

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await authMiddleware()
  const locale = await getLocale()

  if (!session || !session.user) {
    return redirect({
      href: '/',
      locale,
    })
  }

  return (
    <>
      <nav className="flex h-16 flex-row justify-end gap-2 bg-card p-4">
        <UserProfileMenu />
      </nav>
      {children}
    </>
  )
}
