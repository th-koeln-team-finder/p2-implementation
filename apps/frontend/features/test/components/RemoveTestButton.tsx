import { removeAllTests } from '@/features/test/test.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { Trash2Icon } from 'lucide-react'

export function RemoveTestButton() {
  return (
    <Button onClick={removeAllTests} variant="destructive">
      <Trash2Icon size={24} />
      Remove all items
    </Button>
  )
}
