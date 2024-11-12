import type { Metadata } from 'next';
import { Rubik, Saira_Condensed } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@components/theme-provider';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
});
const sairaCondensed = Saira_Condensed({
  variable: '--font-saira-condensed',
  weight: '500',
  subsets: ['latin'],
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.variable} ${sairaCondensed.variable} bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
