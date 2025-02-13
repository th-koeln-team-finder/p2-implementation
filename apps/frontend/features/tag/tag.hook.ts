import { useDebouncedValue } from '@/features/general/utils.hooks'
import { getTagSearchResults } from '@/features/tag/tag.query'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function useTagSearch(enableNewTagCreation = true) {
  const translate = useTranslations('tag')
  const [searchInput, setSearchInput] = useState<string>('')
  const [debouncedSearchInput, isDebouncing] = useDebouncedValue(searchInput)

  const { data, isLoading } = useQuery<{ label: string; value: string }[]>({
    queryFn: async () => {
      const tags = await getTagSearchResults(debouncedSearchInput)
      const mappedTags = tags.map((tag) => ({ label: tag.name, value: tag.id }))
      if (
        enableNewTagCreation &&
        debouncedSearchInput &&
        !tags.some(
          (tag) =>
            tag.name.toLowerCase() === debouncedSearchInput.toLowerCase(),
        )
      ) {
        mappedTags.unshift({
          label: translate('createNewTag', { tagName: debouncedSearchInput }),
          value: `new:${debouncedSearchInput}`,
        })
      }
      return mappedTags
    },
    queryKey: ['tag-search', debouncedSearchInput],
  })

  return {
    searchInput,
    setSearchInput,
    isLoading: isLoading || isDebouncing,
    data,
  }
}
