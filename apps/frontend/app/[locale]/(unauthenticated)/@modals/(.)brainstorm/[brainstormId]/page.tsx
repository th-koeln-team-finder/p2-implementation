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
      <DialogContent className="h-[80%] max-w-4xl">
        <Suspense fallback={<DialogHeaderLoading />}>
          <BrainstormDialogHeader brainstormId={brainstormId} />
        </Suspense>
        <Suspense fallback={<BrainstormDetailsLoading hideHeader />}>
          <BrainstormDetails
            className="h-[calc(80vh-136px)]"
            hideHeader
            sort={sort}
            brainstormId={brainstormId}
          />
        </Suspense>
      </DialogContent>
    </NavigationModal>
  )
}
