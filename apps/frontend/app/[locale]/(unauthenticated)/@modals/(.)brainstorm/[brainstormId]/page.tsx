import { NavigationModal } from '@/features/brainstorm/components/NavigationModal'
import {
  BrainstormDetails,
  BrainstormDialogHeader,
} from '@/features/brainstorm/components/brainstorm-details/BrainstormDetails'
import { DialogContent } from '@repo/design-system/components/ui/dialog'

export default async function BrainstormDetailPage({
  params,
}: { params: Promise<{ brainstormId: string }> }) {
  const { brainstormId } = await params
  return (
    <NavigationModal>
      <DialogContent className="h-[80%] max-w-4xl">
        <BrainstormDialogHeader brainstormId={brainstormId} />
        <BrainstormDetails
          className="h-[calc(80vh-136px)]"
          hideHeader
          brainstormId={brainstormId}
        />
      </DialogContent>
    </NavigationModal>
  )
}
