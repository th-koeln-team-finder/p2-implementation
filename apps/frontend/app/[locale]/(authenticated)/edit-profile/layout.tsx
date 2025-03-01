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

      <div className="flex flex-col divide-y *:py-8 first:*:pt-0 last:*:pb-0 lg:flex-row lg:space-x-12 lg:space-y-0 lg:divide-y-0 *:lg:py-0">
        <aside className="lg:-mx-4 bg-sidebar lg:w-1/5 lg:py-0">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </main>
  )
}
