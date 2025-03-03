import { authMiddleware } from '@/auth'
import { redirect } from '@/features/i18n/routing'
import { getUserSkills } from '@/features/userSkills/userSkills.query'
import SkillsEdit from '@/features/users/components/SkillsEdit'
import { getUser } from '@/features/users/users.query'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function EditSkills() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const user = await getUser(session.user.id)

  const skills = await getUserSkills(user.id)

  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.skills.title')}
      </h2>

      <SkillsEdit userSkills={skills} userId={user.id} />
    </section>
  )
}
