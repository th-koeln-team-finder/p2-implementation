import '@repo/design-system/styles/globals.css'
import Header from '@/features/header/header'
import { DesignSystemProvider } from '@repo/design-system'
import type { Metadata } from 'next'
import { Rubik, Saira_Condensed } from 'next/font/google'

const rubik = Rubik({
  variable: '--font-sans',
  subsets: ['latin'],
})
const sairaCondensed = Saira_Condensed({
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${rubik.variable} ${sairaCondensed.variable} flex flex-col bg-background font-sans text-foreground antialiased`}
      >
        <Header />
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  )
}
