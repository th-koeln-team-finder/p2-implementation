import { authMiddleware } from '@/auth'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu'

export default async function UnauthenticatedLayout({
  children,
  modals,
}: Readonly<{
  children: React.ReactNode
  modals: React.ReactNode
}>) {
  const session = await authMiddleware()
  return (
    <>
      <nav className="flex h-16 flex-row justify-end gap-2 bg-card p-4">
        {session?.user ? (
          <UserProfileMenu />
        ) : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        )}
      </nav>
      {children}
      {modals}
    </>
  )
}
