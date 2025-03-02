import {authMiddleware} from '@/auth'
import {redirect} from '@/features/i18n/routing'
import {getLocale} from 'next-intl/server'
import RegisterPush from "@/features/notifications/components/RegisterPush";

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
      <RegisterPush userId={session.user.id} />
      {children}
    </>
  )
}
