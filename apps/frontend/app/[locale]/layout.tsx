import '@repo/design-system/styles/globals.css'
import { routing } from '@/features/i18n/routing'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Rubik, Saira_Condensed } from 'next/font/google'
import { notFound } from 'next/navigation'

const _rubik = Rubik({
  variable: '--font-sans',
  subsets: ['latin'],
})
const _sairaCondensed = Saira_Condensed({
  variable: '--font-head',
  weight: '500',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Collaborize',
  description: 'Create and find teams to collaborate with',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon/icon_light.ico',
        href: '/favicon/icon_light.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon/icon_dark.ico',
        href: '/favicon/icon_dark.ico',
      },
    ],
  },
}

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
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
