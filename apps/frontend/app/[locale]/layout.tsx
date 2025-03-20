import { AppSidebar } from '@/features/general/components/AppSidebar'
import Header from '@/features/header/header'
import { routing } from '@/features/i18n/routing'
import {
  SidebarInset,
  SidebarProvider,
} from '@repo/design-system/components/ui/sidebar'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import RegisterPush from '@/features/notifications/components/RegisterPush'
import { authMiddleware } from '@/auth'

export default async function RootLayout({
  children,
  params,
  modals,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
  modals: React.ReactNode
}>) {
  const { locale } = await params
  const session = await authMiddleware()
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages}>
        {session?.user?.id && <RegisterPush userId={session.user.id} />}
        <SidebarProvider>
          <SidebarInset>
            {modals}
            <main className="flex min-h-screen w-full flex-col">
              <Header />
              {children}
            </main>
          </SidebarInset>
          <AppSidebar />
        </SidebarProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
