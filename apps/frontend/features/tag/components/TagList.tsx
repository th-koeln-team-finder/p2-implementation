'use client'

import { Badge } from '@repo/design-system/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip'
import { useTranslations } from 'next-intl'

type BrainstormTagListProps = {
  tags: { tag: { id: string; name: string } }[]
  splitUp?: number
}

export function TagList({ tags, splitUp = 0 }: BrainstormTagListProps) {
  const translate = useTranslations('tag')
  const tagsToShow = tags.slice(0, splitUp)
  const otherTags = tags.slice(splitUp)
  return (
    <div className="flex flex-row flex-wrap gap-1 self-start">
      {(splitUp ? tagsToShow : tags).map(({ tag }) => (
        <Badge variant="tag" key={tag.id} className="text-nowrap">
          {tag.name}
        </Badge>
      ))}
      {!!splitUp && !!otherTags.length && (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className="text-nowrap"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                {translate('xMore', { amount: otherTags.length })}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-96">
              <h4 className="mb-2 font-semibold text-lg">
                {translate('otherTags')}
              </h4>
              <div className="flex flex-row flex-wrap gap-1 pb-2">
                {otherTags.map(({ tag }) => (
                  <Badge variant="tag" key={tag.id} className="text-nowrap">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
