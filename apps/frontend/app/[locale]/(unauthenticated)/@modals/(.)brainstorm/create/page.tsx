import { hasSessionPermission } from '@/features/auth/auth.utils'
import { BrainstormCreateForm } from '@/features/brainstorm/components/brainstorm-create/BrainstormCreateForm'
import { NavigationModal } from '@/features/general/components/NavigationModal'
import { redirect } from '@/features/i18n/routing'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function BrainstormPage() {
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
    <NavigationModal>
      <DialogContent className="flex h-full min-w-full flex-col overflow-auto sm:max-h-[80vh] sm:min-w-0 sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <DialogHeader className="pr-4">
          <DialogTitle className="font-head font-medium text-3xl">
            {translate('createFormTitle')}
          </DialogTitle>
        </DialogHeader>
        <BrainstormCreateForm />
      </DialogContent>
    </NavigationModal>
  )
}
