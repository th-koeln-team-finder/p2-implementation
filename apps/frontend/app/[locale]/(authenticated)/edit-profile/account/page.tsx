import {getLocale, getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import {getUser} from "@/features/users/users.query";
import AccountForm from "@/features/users/components/AccountForm";
import {redirect} from "@/features/i18n/routing";
import {deleteUser} from "@/features/users/users.actions";
import DeleteUser from "@/features/users/components/DeleteUser";

export default async function Account() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({href: '/', locale: await getLocale()})
  }

  const user = await getUser(session.user.id) as UserSelect

  const handleDelete = async () => {
    await deleteUser(user.id)
    return redirect({href: '/', locale: await getLocale()})
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.account')}
      </h2>

      <AccountForm user={user} />

      <h3 className="font-bold text-xl my-8">
        {translate('users.settings.dangerZone')}
      </h3>

      <DeleteUser user={user} />
    </section>
  )
}