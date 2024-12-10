import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@repo/design-system/components/ui/card";
import {Badge} from "@repo/design-system/components/ui/badge";
import {Link} from "@/features/i18n/routing";

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  tags?: string[];
}

export function ProjectCard({project}: { project: Project }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/projects/${project.id}`} className="hover:underline">
        <CardHeader className="p-0">
          <img className="max-h-32" src={project.image} alt={project.name}/>
          <CardTitle className="py-4 px-6">{project.name}</CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        <p>{project.description}</p>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        {project.tags ? project.tags.map((tag) => (
          <Badge
            key={tag}
            className="bg-primary-foreground text-muted px-2 hover:bg-primary-foreground"
          >
            {tag}
          </Badge>
        )) : null}
      </CardFooter>
    </Card>
  )
}