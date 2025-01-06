'use client'
import type { PopulatedBrainstorm } from '@/features/brainstorm/brainstorm.types'
import { BrainstormBookmarkButton } from '@/features/brainstorm/components/brainstorm-details/BrainstormBookmarkButton'
import { BrainstormTagList } from '@/features/brainstorm/components/brainstorm-details/BrainstormTagList'
import { Link } from '@/features/i18n/routing'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'

type BrainstormListEntryProps = {
  brainstorm: PopulatedBrainstorm
}

export function BrainstormListEntry({ brainstorm }: BrainstormListEntryProps) {
  return (
    <Link href={`/brainstorm/${brainstorm.id}`}>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-xl">{brainstorm.title}</CardTitle>
            <BrainstormBookmarkButton
              brainstormId={brainstorm.id}
              isBookmarked={brainstorm.isBookmarked}
            />
          </div>
          <CardDescription className="max-h-10 overflow-hidden">
            {brainstorm.description && (
              <WysiwygRenderer value={brainstorm.description} renderAsString />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BrainstormTagList tags={brainstorm.tags} />
        </CardContent>
      </Card>
    </Link>
  )
}
