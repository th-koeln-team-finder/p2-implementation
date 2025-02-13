'use client'

import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { useDebounceFunction } from '@/features/general/utils.hooks'
import { useTagSearch } from '@/features/tag/tag.hook'
import { useForm } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { AutoCompleteTagInputForm } from '@repo/design-system/components/custom/auto-complete-tag-input'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
} from '@repo/design-system/components/ui/collapsible'
import { Input } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

type BrainstormFilterBarProps = {
  disabled?: boolean
}

// TODO Remove tags and apply them to the semantic search (top 5 most used tags)

export function BrainstormFilterBar({ disabled }: BrainstormFilterBarProps) {
  useSignals()

  const translate = useTranslations('brainstorm')

  const [search, setSearchRaw] = useQueryState('search')
  const [tagsQuery, setTagsQuery] = useQueryState('tags')

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(search ?? '')
  const [setSearch, isLoading] = useDebounceFunction(async (input: string) => {
    await setSearchRaw(input)
    await revalidateBrainstorms()
  }, 500)

  const mappedTags = (tagsQuery ?? '')
    .split(',')
    .map((tag) => {
      const [tagId, tagLabel] = tag.split(':')
      if (!tagId || !tagLabel) return null
      return { value: tagId, label: tagLabel }
    })
    .filter((tag) => tag !== null)

  const {
    data,
    isLoading: areTagsLoading,
    searchInput: tagSearchInput,
    setSearchInput: setTagSearchInput,
  } = useTagSearch(false)

  const form = useForm({
    defaultValues: {
      tags: mappedTags,
      createdAfter: null as Date | null,
      createdBefore: null as Date | null,
    },
    onSubmit: async (values) => {
      const reverseMappedTags = values.tags.map(
        (tag) => `${tag.value}:${tag.label}`,
      )
      await setTagsQuery(reverseMappedTags.join(','))
      await revalidateBrainstorms()
    },
  })

  return (
    <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
        {/*<CollapsibleTrigger asChild>*/}
        {/*  <Button disabled={disabled} variant="ghost">*/}
        {/*    Filters*/}
        {/*    {isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}*/}
        {/*  </Button>*/}
        {/*</CollapsibleTrigger>*/}
        <form.FormProvider>
          <form
            className="flex flex-row items-end gap-2"
            onSubmit={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              await form.handleSubmit()
            }}
          >
            <p className="flex h-9 flex-row items-center rounded bg-muted px-4">
              Narrow down by tags:
            </p>
            <form.FieldProvider name="tags">
              <div>
                <Label>Tags</Label>
                <AutoCompleteTagInputForm
                  className="min-w-96"
                  searchInput={tagSearchInput}
                  onSearchInputChange={setTagSearchInput}
                  data={data ?? []}
                  isLoading={areTagsLoading}
                  placeholder={translate('createForm.placeholderTags')}
                  emptyMessage={translate('createForm.emptyTags')}
                  loadingMessage={translate('createForm.loadingTags')}
                  enableCommaSeparation
                  clearAfterSelect
                />
              </div>
            </form.FieldProvider>
            <Button>Apply</Button>
          </form>
        </form.FormProvider>
      </div>
      <CollapsibleContent>
        <form.FormProvider>
          <form
            className="mb-4 flex flex-col items-start gap-2 rounded bg-muted p-4"
            onSubmit={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              await form.handleSubmit()
            }}
          >
            <form.FieldProvider name="tags">
              <div>
                <Label>Tags</Label>
                <AutoCompleteTagInputForm
                  className="min-w-96"
                  searchInput={tagSearchInput}
                  onSearchInputChange={setTagSearchInput}
                  data={data ?? []}
                  isLoading={areTagsLoading}
                  placeholder={translate('createForm.placeholderTags')}
                  emptyMessage={translate('createForm.emptyTags')}
                  loadingMessage={translate('createForm.loadingTags')}
                  enableCommaSeparation
                  clearAfterSelect
                />
              </div>
            </form.FieldProvider>
            <Button>Apply Filters</Button>
          </form>
        </form.FormProvider>
      </CollapsibleContent>
    </Collapsible>
  )
}
