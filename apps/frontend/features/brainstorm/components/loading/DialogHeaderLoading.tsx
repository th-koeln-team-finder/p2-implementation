import {
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog'
import { Skeleton } from '@repo/design-system/components/ui/skeleton'
import { cn } from '@repo/design-system/lib/utils'

type DialogHeaderLoadingProps = {
  withoutIndent?: boolean
}

export function DialogHeaderLoading({
  withoutIndent,
}: DialogHeaderLoadingProps) {
  return (
    <DialogHeader
      className={cn('flex flex-col gap-1', !withoutIndent && 'pr-4')}
    >
      <DialogTitle className="flex flex-row items-center justify-between">
        <Skeleton className="h-9 w-1/3 rounded" />
        <Skeleton className="h-9 w-1/4 rounded" />
      </DialogTitle>
      <Skeleton className="h-4 w-1/4 rounded" />
    </DialogHeader>
  )
}
