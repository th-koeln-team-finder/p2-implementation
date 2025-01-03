import { Badge } from '@repo/design-system/components/ui/badge'

type BrainstormTagListProps = {
  tags: string[]
}

export function BrainstormTagList({ tags }: BrainstormTagListProps) {
  return (
    <div className="flex flex-row gap-1">
      {tags.map((tag) => (
        <Badge variant="tag" key={tag}>
          {tag}
        </Badge>
      ))}
    </div>
  )
}
