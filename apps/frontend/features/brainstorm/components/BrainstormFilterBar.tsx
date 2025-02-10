'use client'

import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { useDebounceFunction } from '@/features/general/utils.hooks'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible'
import { Input } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { FilterIcon, Loader2Icon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

type BrainstormFilterBarProps = {
  disabled?: boolean
}

export function BrainstormFilterBar({ disabled }: BrainstormFilterBarProps) {
  const [search, setSearchRaw] = useQueryState('search')
  const [searchInput, setSearchInput] = useState(search ?? '')
  const [setSearch, isLoading] = useDebounceFunction(async (input: string) => {
    await setSearchRaw(input)
    await revalidateBrainstorms()
  }, 500)
  return (
    <Collapsible>
      <div className="mb-4 flex flex-row items-end gap-2">
        <div>
          <Label>Search</Label>
          <div className="relative">
            {(disabled || isLoading) && (
              <Loader2Icon className="absolute top-1 right-2 animate-spin" />
            )}
            <Input
              autoFocus
              placeholder="Search for ideas..."
              className="min-w-96"
              disabled={disabled}
              value={searchInput}
              onChange={(e) => {
                setSearch(e.target.value)
                setSearchInput(e.target.value)
              }}
            />
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button disabled={disabled}>
            <FilterIcon />
            Filter
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div>Here you can filter for tags...</div>
        <div>Here you can filter for creation date</div>
        <div>
          Here you can filter for recommendations (include tags of recently used
          projects + bookmarked brainstorms + bookmarked projects)
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
