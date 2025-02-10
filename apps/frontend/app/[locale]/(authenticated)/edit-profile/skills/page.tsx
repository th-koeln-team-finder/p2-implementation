import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import { getUserSkills } from '@/features/userSkills/userSkills.query'
import SkillsEdit from '@/features/users/components/SkillsEdit'
import { getUser } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditSkills() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = (await getUser(session.user.id)) as UserSelect

  const skills = await getUserSkills(user.id)

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.skills.title')}
      </h2>

      <SkillsEdit userSkills={skills} userId={user.id} />
    </section>
  )
}
