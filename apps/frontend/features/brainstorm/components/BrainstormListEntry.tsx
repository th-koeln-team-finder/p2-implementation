'use client'
import { Link } from '@/features/i18n/routing'
import type { BrainstormSelect } from '@repo/database/schema'

type BrainstormListEntryProps = {
  brainstorm: BrainstormSelect
}

export function BrainstormListEntry({ brainstorm }: BrainstormListEntryProps) {
  return (
    <div>
      <Link href={`/brainstorm/${brainstorm.id}`}>{brainstorm.title}</Link>
    </div>
  )
}
