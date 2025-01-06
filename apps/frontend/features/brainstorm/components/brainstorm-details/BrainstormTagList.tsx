import { Badge } from '@repo/design-system/components/ui/badge'

type BrainstormTagListProps = {
  tags: { tag: { id: string; name: string } }[]
}

export function BrainstormTagList({ tags }: BrainstormTagListProps) {
  return (
    <div className="flex flex-row flex-wrap gap-1">
      {tags.map(({ tag }) => (
        <Badge variant="tag" key={tag.id} className="text-nowrap">
          {tag.name}
        </Badge>
      ))}
    </div>
  )
}
