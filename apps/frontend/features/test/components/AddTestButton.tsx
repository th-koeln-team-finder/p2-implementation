import { addRandomTest } from '@/features/test/test.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { PlusIcon } from 'lucide-react'

export function AddTestButton() {
  return (
    <Button onClick={addRandomTest}>
      <PlusIcon />
      Add item
    </Button>
  )
}
