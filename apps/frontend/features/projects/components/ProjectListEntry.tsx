import { Link } from '@/features/i18n/routing'
import type { getProjectItems } from '@/features/projects/projects.queries'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import Image from 'next/image'
import { FilePreview } from '@/features/file-upload/components/FilePreview'
import { ProjectListEntryToolbar } from '@/features/projects/components/ProjectListEntryToolbar'

export type FindAProjectListEntryProps = {
  project: Awaited<ReturnType<typeof getProjectItems>>[number]
}

export function ProjectListEntry({ project }: FindAProjectListEntryProps) {
  const firstImage = project.projectPictures?.[0]
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full">
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
        {/* TODO Add tags to projects */}
      </Card>
    </Link>
  )
}
