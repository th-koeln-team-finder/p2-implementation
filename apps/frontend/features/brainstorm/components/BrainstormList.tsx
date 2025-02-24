import { authMiddleware } from '@/auth'
import { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { BrainstormFilterBar } from '@/features/brainstorm/components/BrainstormFilterBar'
import { BrainstormLazyLoader } from '@/features/brainstorm/components/BrainstormLazyLoader'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { ScrollTopButton } from '@repo/design-system/components/custom/ScrollTopButton'
import { Masonry } from '@repo/design-system/components/ui/Masonry'

const pageSize = 20

export async function BrainstormList({
  search,
  tags,
  offset,
  bookmarks,
}: { search: string; tags: string; offset: string; bookmarks: string }) {
  const session = await authMiddleware()
  const offsetNumber = Number.parseInt(offset ?? '0')
  const limit = pageSize + offsetNumber
  const brainstorms = await getBrainstorms(
    session?.user?.id,
    search,
    tags,
    bookmarks === 'pinned',
    limit,
  )
  const hasMore = limit <= brainstorms.length
  return (
    <section className="pb-4">
      <BrainstormFilterBar />
      <Masonry
        masonryGutter="16px"
        columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3, 1200: 4 }}
      >
        {brainstorms.map((brainstorm) => (
          <BrainstormListEntry key={brainstorm.id} brainstorm={brainstorm} />
        ))}
      </Masonry>
      <BrainstormLazyLoader hasMore={hasMore} pageSize={pageSize} />
      <ScrollTopButton />
    </section>
  )
}
