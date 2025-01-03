import { DialogHeaderLoading } from '@/features/brainstorm/components/loading/DialogHeaderLoading'
import { Skeleton } from '@repo/design-system/components/ui/skeleton'

type BrainstormDetailsLoadingProps = { hideHeader?: boolean }

export function BrainstormDetailsLoading({
  hideHeader,
}: BrainstormDetailsLoadingProps) {
  return (
    <div className="-mr-3 mt-4 flex flex-col gap-2 overflow-auto pr-3 pb-4">
      {!hideHeader && <DialogHeaderLoading withoutIndent />}
      <Skeleton className="min-h-5 w-full rounded" />
      <Skeleton className="min-h-5 w-full rounded" />
      <Skeleton className="min-h-5 w-full rounded" />
      <Skeleton className="min-h-5 w-full rounded" />
      <Skeleton className="min-h-5 w-1/3 rounded" />
      <Skeleton className="min-h-96 w-full rounded" />
      <Skeleton className="min-h-5 w-1/4 rounded" />
      <Skeleton className="min-h-5 w-1/3 rounded" />
      <Skeleton className="min-h-5 w-1/3 rounded" />
      <div className="flex flex-row gap-1">
        <Skeleton className="min-h-8 flex-1 rounded" />
        <Skeleton className="min-h-8 w-1/6 rounded" />
      </div>
      <div className="flex flex-row justify-between">
        <Skeleton className="min-h-5 w-1/4 rounded" />
        <Skeleton className="min-h-5 w-1/6 rounded" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i.toFixed(2)} className="flex flex-row gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="w-full">
            <Skeleton className="mb-1 h-4 w-1/3 rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
