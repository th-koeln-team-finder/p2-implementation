import { authMiddleware } from '@/auth'
import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { LazyLoader } from '@/features/general/components/LazyLoader'
import { Masonry } from '@repo/design-system/components/ui/Masonry'
import { getTranslations } from 'next-intl/server'

const pageSize = 15

export async function BrainstormList({
  search,
  tags,
  offset,
  bookmarks,
}: { search: string; tags: string; offset: string; bookmarks: string }) {
  const session = await authMiddleware()
  const translate = await getTranslations('brainstorm')

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
    <>
      {!brainstorms.length && (
        <p className="col-span-3 my-3 text-center text-muted-foreground italic">
          {translate('emptyBrainstorms')}
        </p>
      )}
      <Masonry
        masonryGutter="16px"
        columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3, 1400: 4 }}
      >
        {brainstorms.map((brainstorm) => (
          <BrainstormListEntry key={brainstorm.id} brainstorm={brainstorm} />
        ))}
      </Masonry>
      <LazyLoader
        hasMore={hasMore}
        pageSize={pageSize}
        onInvalidate={revalidateBrainstorms}
      />
    </>
  )
}
