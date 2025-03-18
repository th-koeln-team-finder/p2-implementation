import { FilePreview } from '@/features/file-upload/components/FilePreview'
import { Link } from '@/features/i18n/routing'
import { ProjectListEntryToolbar } from '@/features/projects/components/ProjectListEntryToolbar'
import type { getProjectItems } from '@/features/projects/projects.queries'
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
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type FindAProjectListEntryProps = {
  project: Awaited<ReturnType<typeof getProjectItems>>[number]
}

export async function ProjectListEntry({
  project,
}: FindAProjectListEntryProps) {
  const matchingTranslate = await getTranslations('projects.matching')
  const firstImage = project.projectPictures?.[0]
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="relative h-full">
        {project.projectTotalMatchScore &&
          +project.projectTotalMatchScore > 0 && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger className="absolute top-1 right-1 flex flex-row items-center gap-1 rounded bg-primary px-2 py-1 text-primary-foreground text-sm">
                  <ShellIcon className="size-4" />
                  {(project.projectTotalMatchScore * 100).toFixed(0)}
                </TooltipTrigger>
                <TooltipContent>
                  <h6 className="font-semibold text-lg">
                    {matchingTranslate('tooltipTitle')}
                  </h6>
                  <p className="mb-2 max-w-xs text-muted-foreground">
                    {matchingTranslate('tooltipDescription')}
                  </p>
                  <table className="text-left" cellSpacing="0">
                    <tbody>
                      <tr className="bg-card">
                        <th className="p-1">
                          {matchingTranslate('skillMatchingScore')}
                        </th>
                        <td className="min-w-12 p-1 text-right">
                          {(project.projectSkillMatchScore * 100).toFixed(0)}
                        </td>
                      </tr>
                      <tr className="bg-card/40">
                        <th className="p-1">
                          {matchingTranslate('interestMatchingScore')}
                        </th>
                        <td className="min-w-12 p-1 text-right">
                          {(project.projectTagMatchScore * 100).toFixed(0)}
                        </td>
                      </tr>
                      <tr className="border-border border-t bg-card">
                        <th className="p-1">
                          {matchingTranslate('totalMatchingScore')}
                        </th>
                        <td className="min-w-12 p-1 text-right">
                          {(project.projectTotalMatchScore * 100).toFixed(0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        {firstImage?.uploadedFile ? (
          <FilePreview
            file={firstImage.uploadedFile}
            className="h-48 w-full rounded-t object-cover"
            height={800}
            width={1200}
          />
        ) : (
          <Image
            className="h-48 w-full rounded-t object-cover"
            src="/images/image-placeholder.jpg"
            height={800}
            width={1200}
            alt={project.name}
          />
        )}

        <CardHeader>
          <div className="-mb-2 flex flex-row flex-wrap gap-1 text-xs">
            {project.totalSimilarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                similarity:{' '}
                <span className="text-muted-foreground">
                  {project.totalSimilarity?.toFixed(2)}
                </span>
              </span>
            )}
            {project.similarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                content:{' '}
                <span className="text-muted-foreground">
                  {project.similarity?.toFixed(2)}
                </span>
              </span>
            )}
            {project.issueSimilarity && (
              <span className="rounded bg-muted px-1 text-muted-foreground/80">
                issues:{' '}
                <span className="text-muted-foreground">
                  {project.issueSimilarity?.toFixed(2)}
                </span>
              </span>
            )}
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <ProjectListEntryToolbar
              projectId={project.id}
              isStared={project.isStared}
              projectStars={project.projectStars}
              isBookmarked={project.isBookmarked}
            />
          </div>

          <CardDescription className="max-h-20 overflow-hidden">
            {project.description && (
              <WysiwygRenderer value={project.description} renderAsString />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagList tags={project.tags} splitUp={4} />
        </CardContent>
      </Card>
    </Link>
  )
}
