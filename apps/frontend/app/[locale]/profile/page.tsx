import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import Profile from '@/features/users/components/Profile'
import { getUser } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { getLocale } from 'next-intl/server'
import {UserWithImage} from "@/features/users/users.types";

export default async function ProfilePage() {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = (await getUser(session.user.id)) as UserWithImage

  return (
    <main className="container px-4 mx-auto my-4">
      <Profile user={user} />
    </main>
  )
}
