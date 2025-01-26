import { getTranslations } from 'next-intl/server'

export default async function EditProfile() {
  const translate = await getTranslations()

  return (
    <section className="mt-8">
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.security')}
      </h2>
    </section>
  )
}
