import {getTranslations} from "next-intl/server";
import {SidebarNav} from "@/features/users/components/SidebarNav";

export default async function EditProfileLayout({children}: Readonly<{
  children: React.ReactNode
}>) {
  const translate = await getTranslations('users.settings')

  const sidebarNavItems = [
    {
      title: translate('profile'),
      href: '/edit-profile/profile',
    },
    {
      title: translate('skills.title'),
      href: "/edit-profile/skills",
    },
    {
      title: translate('account'),
      href: "/edit-profile/account",
    },
    {
      title: translate('notifications.title'),
      href: "/edit-profile/notifications",
    },
  ]

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-3xl font-bold mb-8">
        {translate('title')}
      </h1>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems}/>
        </aside>
        <main className="flex-1 lg:max-w-2xl">{children}</main>
      </div>
    </div>
  )
}