import { Link } from '@/features/i18n/routing'
import { Badge } from '@repo/design-system/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'


interface Project {
  id: number
  name: string
  description: string
  image?: string
  tags?: string[]
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/projects/${project.id}`} className="hover:underline">
        <CardHeader className="p-0">
            {project.image &&(
            <img
              className="max-h-32"
              src={project.image}
              alt={project.name}
            />
          )}
          <CardTitle className="px-6 py-4">{project.name}</CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        <p>{project.description}</p>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        {project.tags
          ? project.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-primary-foreground px-2 text-muted hover:bg-primary-foreground"
              >
                {tag}
              </Badge>
            ))
          : null}
      </CardFooter>
    </Card>
  )
}
