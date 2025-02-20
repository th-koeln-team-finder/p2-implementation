import { authMiddleware } from '@/auth'
import { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { BrainstormFilterBar } from '@/features/brainstorm/components/BrainstormFilterBar'
import { BrainstormLazyList } from '@/features/brainstorm/components/BrainstormLazyList'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { Masonry } from '@repo/design-system/components/ui/Masonry'

const pageSize = 25

export async function BrainstormList({
  search,
  tags,
  offset,
}: { search: string; tags: string; offset: string }) {
  const session = await authMiddleware()
  const offsetNumber = Number.parseInt(offset)
  // TODO Include offset here as well
  const brainstorms = await getBrainstorms(
    session?.user?.id,
    search,
    tags,
    pageSize + offsetNumber,
  )
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
      <BrainstormLazyList
        userId={session?.user?.id}
        search={search}
        tags={tags}
        pageSize={pageSize}
      />
    </section>
  )
}
