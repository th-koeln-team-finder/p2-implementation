import {getLocale, getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import SkillsEdit from "@/features/users/components/SkillsEdit";
import {getUser, getUserSkills} from "@/features/users/users.query";
import ProfileForm from "@/features/users/components/ProfileForm";
import {redirect} from "@/features/i18n/routing";

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({href: '/', locale: await getLocale()})
  }
  const user = await getUser(session.user.id) as UserSelect

  const skills = await getUserSkills(user.id)

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.profile')}
      </h2>

      <ProfileForm user={user}/>

      <hr className="my-8"/>

      <SkillsEdit userSkills={skills} userId={user.id}/>
    </section>
  )
}