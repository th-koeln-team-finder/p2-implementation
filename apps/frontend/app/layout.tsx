import '@repo/design-system/styles/globals.css'
import { authMiddleware } from '@/auth'
import { QueryClientProvider } from '@/features/general/queryClient'
import Header from '@/features/header/header'
import { getUser } from '@/features/users/users.query'
import type { UserWithImage } from '@/features/users/users.types'
import { DesignSystemProvider } from '@repo/design-system'
import type { Metadata } from 'next'
import { Rubik, Saira_Condensed } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await authMiddleware()

  const user = session?.user
    ? ((await getUser(session?.user.id)) as UserWithImage)
    : undefined
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${rubik.variable} ${sairaCondensed.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <Header user={user} />
        <QueryClientProvider>
          <NuqsAdapter>
            <DesignSystemProvider>{children}</DesignSystemProvider>
          </NuqsAdapter>
        </QueryClientProvider>
      </body>
    </html>
  )
}
