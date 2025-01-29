import {getLocale, getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import {getUser} from "@/features/users/users.query";
import {redirect} from "@/features/i18n/routing";
import UserProjectsEdit from "@/features/userProjects/components/UserProjectsEdit";
import {getUserProjects} from "@/features/userProjects/userProjects.query";

export default async function EditProjects() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({href: '/', locale: await getLocale()})
  }
  const user = await getUser(session.user.id) as UserSelect

  const projects = await getUserProjects(user.id)
  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.projects.title')}
      </h2>

      <UserProjectsEdit userProjects={projects} userId={user.id} />
    </section>
  )
}