import {getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  const user = session!.user! as UserSelect

  function deleteAccount() {
    alert('Account deleted')
  }

  return (
    <section className="mt-8">
      <h2 className="font-bold text-2xl mb-8">{
        translate('users.settings.security')}
      </h2>
    </section>
  )
}