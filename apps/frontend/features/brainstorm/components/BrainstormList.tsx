import { authMiddleware } from '@/auth'
import { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { BrainstormFilterBar } from '@/features/brainstorm/components/BrainstormFilterBar'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { Masonry } from '@repo/design-system/components/ui/Masonry'

export async function BrainstormList({
  search,
  tags,
}: { search: string; tags: string }) {
  const session = await authMiddleware()
  const brainstorms = await getBrainstorms(session?.user?.id, search, tags)
  return (
    <section>
      <BrainstormFilterBar />
      <Masonry
        masonryGutter="16px"
        columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3, 1200: 4 }}
      >
        {brainstorms.map((brainstorm) => (
          <BrainstormListEntry key={brainstorm.id} brainstorm={brainstorm} />
        ))}
      </Masonry>
    </section>
  )
}
