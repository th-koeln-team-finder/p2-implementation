import { redirect } from '@/features/i18n/routing'
import Profile from '@/features/users/components/Profile'
import { getUser } from '@/features/users/users.query'
import type { UserWithImage } from '@/features/users/users.types'
import { getLocale } from 'next-intl/server'

export default async function ProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const id: string = (await params).id
  const user = (await getUser(id)) as UserWithImage
  if (!user) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <main className="container px-4 mx-auto my-4">
      <Profile user={user} />
    </main>
  )
}
