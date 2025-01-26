import { Link } from '@/features/i18n/routing'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/design-system/components/ui/card'
import {PopulatedProjects} from "@/features/findAProject/findAproject.types";

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

                <CardContent>
                    Krasse, aber auch nicht zu lange Beschreibung für krasse Projekte
                </CardContent>
            </Card>
        </Link>
    )
}
