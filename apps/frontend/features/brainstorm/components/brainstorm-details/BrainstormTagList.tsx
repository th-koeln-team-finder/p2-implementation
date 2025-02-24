import { Badge } from '@repo/design-system/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip'

type BrainstormTagListProps = {
  tags: { tag: { id: string; name: string } }[]
  splitUp?: number
}

export function BrainstormTagList({
  tags,
  splitUp = 0,
}: BrainstormTagListProps) {
  const tagsToShow = tags.slice(0, splitUp)
  const otherTags = tags.slice(splitUp)
  return (
    <div className="flex flex-row flex-wrap gap-1">
      {(splitUp ? tagsToShow : tags).map(({ tag }) => (
        <Badge variant="tag" key={tag.id} className="text-nowrap">
          {tag.name}
        </Badge>
      ))}
      {!!splitUp && !!otherTags.length && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="text-nowrap">
                {otherTags.length} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-96">
              <h4 className="mb-2 font-semibold text-lg">Other Tags</h4>
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
