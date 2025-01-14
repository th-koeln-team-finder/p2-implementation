import {getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import SkillsEdit from "@/features/users/components/SkillsEdit";
import {getUserSkills} from "@/features/users/users.query";
import ProfileForm from "@/features/users/components/ProfileForm";

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  const user = session!.user! as UserSelect

  const skills = await getUserSkills(user.id)

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.profile')}
      </h2>

      <ProfileForm user={user}/>

      <SkillsEdit userSkills={skills} userId={user.id}/>
    </section>
  )
}