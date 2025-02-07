import { hasSessionPermission } from '@/features/auth/auth.utils'
import { BrainstormCreateForm } from '@/features/brainstorm/components/brainstorm-create/BrainstormCreateForm'
import { redirect } from '@/features/i18n/routing'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function BrainstormCreatePage() {
  const [locale, translate] = await Promise.all([
    getLocale(),
    getTranslations('brainstorm'),
  ])
  const canCreateBrainstorm = await hasSessionPermission('brainstorm', 'create')
  if (!canCreateBrainstorm) {
    return redirect({
      locale,
      href: '/brainstorm',
    })
  }
  return (
    <section className="container mx-auto px-4">
      <h1 className="mb-4 font-head font-medium text-3xl">
        {translate('createFormTitle')}
      </h1>
      <BrainstormCreateForm />
    </section>
  )
}
