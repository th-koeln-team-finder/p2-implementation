'use client'

import { findSimilarTags } from '@/features/test/test.actions'
import { Input } from '@repo/design-system/components/ui/input'
import { useEffect, useRef, useState } from 'react'

export function TestSemanticSearch() {
  const debounceTimeout = useRef<NodeJS.Timeout>()
  const [value, setValue] = useState('')
  const [similarTags, setSimilarTags] = useState<
    { name: string; text_similarity: number; similarity: number }[]
  >([])

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(async () => {
      const response = await findSimilarTags(value)
      setSimilarTags(response)
    }, 500)
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [value])

  return (
    <section>
      <h1>Semantic Tags</h1>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for tag..."
      />
      <ul>
        {similarTags.map((tag) => (
          <li key={tag.name}>
            {tag.name} - {tag.similarity} - {tag.text_similarity}
          </li>
        ))}
      </ul>
    </section>
  )
}
