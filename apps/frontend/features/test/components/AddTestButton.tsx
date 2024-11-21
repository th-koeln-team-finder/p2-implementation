import { addRandomTest } from '@/features/test/test.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function AddTestButton() {
  const t = await getTranslations('test.actions')
  return (
    <Button onClick={addRandomTest}>
      <PlusIcon />
      {t('addItem')}
    </Button>
  )
}
