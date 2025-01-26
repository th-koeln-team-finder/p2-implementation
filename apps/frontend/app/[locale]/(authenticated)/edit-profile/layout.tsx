import { SidebarNav } from '@/features/users/components/SidebarNav'
import { getTranslations } from 'next-intl/server'

export default async function EditProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const translate = await getTranslations()

  const sidebarNavItems = [
    {
      title: translate('users.settings.profile'),
      href: '/edit-profile/profile',
    },
    {
      title: translate('users.settings.account'),
      href: '/edit-profile/account',
    },
    {
      title: translate('users.settings.security'),
      href: '/edit-profile/security',
    },
    {
      title: translate('users.settings.notifications'),
      href: '/edit-profile/notifications',
    },
  ]

  return (
    <div className="container mx-auto my-4">
      <h1 className="mb-8 font-bold text-3xl">
        {translate('users.settings.title')}
      </h1>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 lg:max-w-2xl">{children}</main>
      </div>
    </div>
  )
}
