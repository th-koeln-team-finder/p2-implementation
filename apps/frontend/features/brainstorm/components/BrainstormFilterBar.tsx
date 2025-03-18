'use client'
import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { useDebounceFunction } from '@/features/general/utils.hooks'
import { useSignals } from '@preact/signals-react/runtime'
import { Input } from '@repo/design-system/components/ui/input'
import { cn } from '@repo/design-system/lib/utils'
import { InfoIcon, Loader2Icon, SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

export function BrainstormFilterBar() {
  useSignals()

  const translate = useTranslations('brainstorm')

  const [bookmarks, setBookmarks] = useQueryState('bookmarks')
  const bookmarksPinned = bookmarks === 'pinned'
  const [search, setSearchRaw] = useQueryState('search')
  const [_, setOffset] = useQueryState('offset')

  const [searchInput, setSearchInput] = useState(search ?? '')
  const [setSearch, isLoading] = useDebounceFunction(async (input: string) => {
    await Promise.all([setSearchRaw(input), setOffset('0')])
    await revalidateBrainstorms()
  }, 500)

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-2 left-3 text-muted-foreground" />
          {isLoading && (
            <Loader2Icon className="absolute top-2 right-3 animate-spin" />
          )}
          <Input
            type="search"
            autoFocus
            placeholder={translate('searchPlaceholder')}
            className={cn(
              'h-10 flex-1 pl-11 md:text-md',
              isLoading && '[&::-webkit-search-cancel-button]:hidden',
            )}
            value={searchInput}
            onChange={(e) => {
              setSearch(e.target.value)
              setSearchInput(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="mt-2 flex flex-row items-center gap-2 rounded border-primary border-l-4 bg-primary/20 p-2 text-foreground text-sm">
        <InfoIcon className="size-4 min-w-4" />
        {translate('searchNotice')}
      </div>
    </div>
  )
}
