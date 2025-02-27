import { SidebarNav } from '@/features/users/components/SidebarNav'
import { getTranslations } from 'next-intl/server'
import {BadgeCheck, BellIcon, NotebookTabsIcon, SettingsIcon, SquareUserIcon, UserIcon, WrenchIcon} from "lucide-react";

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
      icon: <NotebookTabsIcon />
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
      <h1 className="text-3xl font-bold mb-8">{translate('title')}</h1>

      <div className="flex flex-col *:py-8 first:*:pt-0 last:*:pb-0 *:lg:py-0 lg:flex-row lg:space-x-12 lg:space-y-0 divide-y lg:divide-y-0">
        <aside className="lg:-mx-4 lg:w-1/5 bg-sidebar lg:py-0">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 lg:max-w-2xl">{children}</main>
      </div>
    </main>
  )
}
