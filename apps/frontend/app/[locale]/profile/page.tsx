import {authMiddleware} from '@/auth'
import {redirect} from '@/features/i18n/routing'
import Profile from '@/features/users/components/Profile'
import {getUserWithImage} from '@/features/users/users.query'
import type {UserWithImage} from '@/features/users/users.types'
import {getLocale} from 'next-intl/server'

export default async function ProfilePage() {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = await getUserWithImage(session.user.id)
  if (!user) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  return (
    <main className="container mx-auto my-4 px-4">
      <Profile user={user} />
    </main>
  )
}
