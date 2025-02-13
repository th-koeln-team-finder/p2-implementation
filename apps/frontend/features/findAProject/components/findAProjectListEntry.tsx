import type { PopulatedProjects } from '@/features/findAProject/findAproject.types'
import { Link } from '@/features/i18n/routing'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'

type FindAProjectListEntryProps = {
  project: PopulatedProjects
}

export function FindAProjectListEntry({ project }: FindAProjectListEntryProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </div>

          <CardDescription className="max-h-10 overflow-hidden">
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
