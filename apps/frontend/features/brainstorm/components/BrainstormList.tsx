import { authMiddleware } from '@/auth'
import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import {
  getBrainstorms,
  getBrainstormsByCreatorID,
} from '@/features/brainstorm/brainstorm.queries'
import { BrainstormListEntry } from '@/features/brainstorm/components/BrainstormListEntry'
import { LazyLoader } from '@/features/general/components/LazyLoader'
import { Masonry } from '@repo/design-system/components/ui/Masonry'
import { getTranslations } from 'next-intl/server'

const pageSize = 15

export async function BrainstormList({
  search,
  offset,
  bookmarks,
  createdById,
}: {
  search: string
  offset: string
  bookmarks: string
  createdById?: string
}) {
  const session = await authMiddleware()
  const translate = await getTranslations('brainstorm')

  const offsetNumber = Number.parseInt(offset ?? '0')
  const limit = pageSize + offsetNumber
  const brainstorms = createdById
    ? await getBrainstormsByCreatorID(
        createdById,
        session?.user?.id,
        search,
        bookmarks === 'pinned',
        limit,
      )
    : await getBrainstorms(
        session?.user?.id,
        search,
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
