import {getUser} from '@/features/users/users.query'
import Profile from "@/features/users/components/Profile";
import {redirect} from "@/features/i18n/routing";
import {getLocale} from "next-intl/server";

export default async function ProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const id: string = (await params).id
  const user = await getUser(id)
  if (!user) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <main className="container mx-auto my-4">
      <Profile user={user} />
    </main>
  )
}
