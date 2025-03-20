import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import { SidebarNav } from '@/features/users/components/SidebarNav'
import {
  BadgeCheck,
  BellIcon,
  NotebookTabsIcon,
  SettingsIcon,
  SquareUserIcon,
} from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditProfileLayout({
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

  const translate = await getTranslations('users.settings')

  const sidebarNavItems = [
    {
      title: translate('profile'),
      href: '/settings/profile',
      icon: <SquareUserIcon />,
    },
    {
      title: translate('skills.title'),
      href: '/settings/skills',
      icon: <BadgeCheck />,
    },
    {
      title: translate('projects.title'),
      href: '/settings/projects',
      icon: <NotebookTabsIcon />,
    },
    {
      title: translate('account'),
      href: '/settings/account',
      icon: <SettingsIcon />,
    },
    {
      title: translate('notifications.title'),
      href: '/settings/notifications',
      icon: <BellIcon />,
    },
  ]

  return (
    <main className="container mx-auto my-4 px-4">
      <h1 className="mb-8 font-bold text-2xl">{translate('title')}</h1>

      <div className="flex flex-col lg:flex-row">
        <aside className="lg:-mx-4 mb-6 border-b bg-sidebar pb-6 lg:mr-6 lg:mb-0 lg:w-1/5 lg:border-b-0 lg:pr-6 lg:pb-0">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </main>
  )
}
