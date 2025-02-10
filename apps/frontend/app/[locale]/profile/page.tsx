import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import Profile from '@/features/users/components/Profile'
import { getUser } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { getLocale } from 'next-intl/server'

export default async function ProfilePage() {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = (await getUser(session.user.id)) as UserSelect

  return (
    <main className="container mx-auto my-4">
      <Profile user={user} />
    </main>
  )
}
