import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import { getLocale } from 'next-intl/server'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await authMiddleware()
  const locale = await getLocale()

  if (session) {
    return redirect({
      href: '/',
      locale,
    })
  }

  return children
}
