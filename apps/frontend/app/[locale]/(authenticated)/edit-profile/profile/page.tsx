import { authMiddleware } from '@/auth'
import SkillsEdit from '@/features/users/components/SkillsEdit'
import { getUserSkills } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { getTranslations } from 'next-intl/server'

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()

  if (!session) {
    return <div>Not logged in</div>
  }

  const user = session.user as UserSelect

  const skills = await getUserSkills(user.id)

  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.profile')}
      </h2>

      <textarea className="mb-4">{user.bio}</textarea>

      <SkillsEdit userSkills={skills} userId={user.id} />
    </section>
  )
}
