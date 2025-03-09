import Header from '@/features/header/header'
import { routing } from '@/features/i18n/routing'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import {
  SidebarInset,
  SidebarProvider,
} from '@repo/design-system/components/ui/sidebar'
import { AppSidebar } from '@/features/general/components/AppSidebar'

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages}>
        <SidebarProvider>
          <SidebarInset>
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
