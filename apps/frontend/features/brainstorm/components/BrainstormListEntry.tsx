'use client'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { BrainstormBookmarkButton } from '@/features/brainstorm/components/brainstorm-details/BrainstormBookmarkButton'
import { Link } from '@/features/i18n/routing'
import { TagList } from '@/features/tag/components/TagList'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip'
import { ShellIcon } from 'lucide-react'
import type { getBrainstorms } from '@/features/brainstorm/brainstorm.queries'
import { useTranslations } from 'next-intl'

type BrainstormListEntryProps = {
  brainstorm: Awaited<ReturnType<typeof getBrainstorms>>[number]
}

export function BrainstormListEntry({ brainstorm }: BrainstormListEntryProps) {
  const matchingTranslate = useTranslations('projects.matching')
  return (
    <Link href={`/brainstorm/${brainstorm.id}`}>
      <Card>
        <CardHeader>
          <div className="-mb-2 flex flex-row flex-wrap gap-1 text-xs">
            {brainstorm.totalSimilarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                similarity:{' '}
                <span className="text-muted-foreground">
                  {brainstorm.totalSimilarity?.toFixed(2)}
                </span>
              </span>
            )}
            {brainstorm.similarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                content:{' '}
                <span className="text-muted-foreground">
                  {brainstorm.similarity?.toFixed(2)}
                </span>
              </span>
            )}
            {brainstorm.commentSimilarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                comments:{' '}
                <span className="text-muted-foreground">
                  {brainstorm.commentSimilarity?.toFixed(2)}
                </span>
              </span>
            )}
            {brainstorm.tagSimilarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                tags:{' '}
                <span className="text-muted-foreground">
                  {brainstorm.tagSimilarity?.toFixed(2)}
                </span>
              </span>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            {brainstorm.totalMatchScore && +brainstorm.totalMatchScore > 0 && (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="flex flex-row items-center gap-1 rounded bg-muted px-2 py-1 text-foreground text-xs">
                    <ShellIcon className="size-3" />
                    {(brainstorm.totalMatchScore * 100).toFixed(0)}
                  </TooltipTrigger>
                  <TooltipContent>
                    <h6 className="font-semibold text-lg">
                      {matchingTranslate('tooltipTitle')}
                    </h6>
                    <p className="mb-2 max-w-xs text-muted-foreground">
                      {matchingTranslate('tooltipDescription')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <CanUserClient target="commentBrainstorm" action="create">
              <BrainstormBookmarkButton
                className="ml-auto"
                brainstormId={brainstorm.id}
                isBookmarked={brainstorm.isBookmarked}
              />
            </CanUserClient>
          </div>
          <CardTitle className="text-xl">{brainstorm.title}</CardTitle>
          <CardDescription className="max-h-10 overflow-hidden">
            {brainstorm.description && (
              <WysiwygRenderer value={brainstorm.description} renderAsString />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagList tags={brainstorm.tags} />
        </CardContent>
      </Card>
    </Link>
  )
}
