'use client'

import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { useDebounceFunction } from '@/features/general/utils.hooks'
import { useSignals } from '@preact/signals-react/runtime'
import { Input } from '@repo/design-system/components/ui/input'
import { InfoIcon, Loader2Icon, SearchIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

// TODO Add button for bookmarks + navigate in drop down menu to this page

type BrainstormFilterBarProps = {
  disabled?: boolean
}

export function BrainstormFilterBar({ disabled }: BrainstormFilterBarProps) {
  useSignals()

  const [search, setSearchRaw] = useQueryState('search')

  const [searchInput, setSearchInput] = useState(search ?? '')
  const [setSearch, isLoading] = useDebounceFunction(async (input: string) => {
    await setSearchRaw(input)
    await revalidateBrainstorms()
  }, 500)

  return (
    <div className="mb-8">
      <div className="relative">
        <SearchIcon className="absolute top-3 left-3 text-muted-foreground" />
        {(disabled || isLoading) && (
          <Loader2Icon className="absolute top-3 right-3 animate-spin" />
        )}
        <Input
          autoFocus
          placeholder="Search for everything..."
          className="h-12 pl-11 md:text-xl"
          disabled={disabled}
          value={searchInput}
          onChange={(e) => {
            setSearch(e.target.value)
            setSearchInput(e.target.value)
          }}
        />
      </div>
      <div className="mt-2 flex flex-row items-center gap-1 rounded border-primary border-l-4 bg-primary/20 p-2 text-foreground">
        <InfoIcon />
        You may also search with whole sentences, since we are semantically
        searching for you.
      </div>
    </div>
  )
}
