import { removeAllTests } from '@/features/test/test.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function RemoveTestButton() {
  const t = await getTranslations('test.actions')
  return (
    <Button onClick={removeAllTests} variant="destructive">
      <Trash2Icon size={24} />
      {t('removeAll')}
    </Button>
  )
}
