import { NavigationModal } from '@/features/brainstorm/components/NavigationModal'
import {
  BrainstormDetails,
  BrainstormDialogHeader,
} from '@/features/brainstorm/components/brainstorm-details/BrainstormDetails'
import { BrainstormDetailsLoading } from '@/features/brainstorm/components/loading/BrainstormDetailsLoading'
import { DialogHeaderLoading } from '@/features/brainstorm/components/loading/DialogHeaderLoading'
import { DialogContent } from '@repo/design-system/components/ui/dialog'
import { Suspense } from 'react'

export default async function BrainstormDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ brainstormId: string }>
  searchParams: Promise<{ sort: string }>
}) {
  const { brainstormId } = await params
  const { sort } = await searchParams
  return (
    <NavigationModal>
      <DialogContent className="flex h-full min-w-full flex-col sm:max-h-[80vh] sm:min-w-0 sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <Suspense fallback={<DialogHeaderLoading />}>
          <BrainstormDialogHeader brainstormId={brainstormId} />
        </Suspense>
        <Suspense fallback={<BrainstormDetailsLoading hideHeader />}>
          <BrainstormDetails
            className="h-full"
            hideHeader
            sort={sort}
            brainstormId={brainstormId}
          />
        </Suspense>
      </DialogContent>
    </NavigationModal>
  )
}
