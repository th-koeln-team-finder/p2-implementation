import { FindAProjectListEntry } from '@/features/findAProject/components/findAProjectListEntry'
import { getProjectItems } from '@/features/projects/projects.queries'
import { Masonry } from '@repo/design-system/components/ui/Masonry'

export async function FindAprojectList() {
  const projects = await getProjectItems()
  if (!projects.length)
    return <p className="text-muted-foreground italic">No data</p>

  return (
    <Masonry
      masonryGutter="16px"
      columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3, 1200: 4 }}
    >
      {projects.map((project) => (
        <FindAProjectListEntry key={project.id} project={project} />
      ))}
    </Masonry>
  )
}
