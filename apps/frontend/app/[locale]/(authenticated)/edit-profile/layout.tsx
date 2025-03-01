import { SidebarNav } from '@/features/users/components/SidebarNav'
import {
  BadgeCheck,
  BellIcon,
  NotebookTabsIcon,
  SettingsIcon,
  SquareUserIcon,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function EditProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const translate = await getTranslations('users.settings')

  const sidebarNavItems = [
    {
      title: translate('profile'),
      href: '/edit-profile/profile',
      icon: <SquareUserIcon />,
    },
    {
      title: translate('skills.title'),
      href: '/edit-profile/skills',
      icon: <BadgeCheck />,
    },
    {
      title: translate('projects.title'),
      href: '/edit-profile/projects',
      icon: <NotebookTabsIcon />,
    },
    {
      title: translate('account'),
      href: '/edit-profile/account',
      icon: <SettingsIcon />,
    },
    {
      title: translate('notifications.title'),
      href: '/edit-profile/notifications',
      icon: <BellIcon />,
    },
  ]

  return (
    <main className="container mx-auto my-4 px-4">
      <h1 className="mb-8 font-bold text-3xl">{translate('title')}</h1>

      <div className="flex flex-col lg:flex-row">
        <aside className="lg:-mx-4 bg-sidebar lg:w-1/5 pb-6 mb-6 lg:pr-6 lg:mr-6 lg:pb-0 lg:mb-0 border-b lg:border-b-0">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </main>
  )
}
