
import { Masonry } from '@repo/design-system/components/ui/Masonry'
import {getProjectItems} from "@/features/projects/projects.queries";
import {FindAProjectListEntry} from "@/features/findAProject/components/findAProjectListEntry";

export async function FindAprojectList() {
    const projects = await getProjectItems()
    if (!projects.length)
        return <p className="text-muted-foreground italic">No data</p>

    return (
        <Masonry
            masonryGutter="16px"
            columnsCountBreakPoints={{ 350: 2, 640: 3, 768: 4 }}
        >
            {projects.map((project) => (
                <FindAProjectListEntry key={project.id} project={project} />
            ))}
        </Masonry>
    )
}
