import { authMiddleware } from '@/auth'
import { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { Masonry } from '@repo/design-system/components/ui/Masonry'

export async function BrainstormList() {
  const session = await authMiddleware()
  const brainstorms = await getBrainstorms(session?.user?.id)
  return (
    <Masonry
      masonryGutter="16px"
      columnsCountBreakPoints={{ 350: 2, 640: 3, 768: 4 }}
    >
      {brainstorms.map((brainstorm) => (
        <BrainstormListEntry key={brainstorm.id} brainstorm={brainstorm} />
      ))}
    </Masonry>
  )
}
