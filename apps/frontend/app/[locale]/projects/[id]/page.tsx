import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { Links } from '@/features/projects/components/Links'
import { Location } from '@/features/projects/components/Location'
import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { SkillScale } from '@/features/projects/components/SkillScale'
import TeamMembers from '@/features/projects/components/TeamMembers'
import { Text } from '@/features/projects/components/Text'
import { Toolbar } from '@/features/projects/components/Toolbar'
import { getProjectItem } from '@/features/projects/projects.queries'


export default async function Projects({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  const project = await getProjectItem(id)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="mx-auto inline-flex w-full max-w-screen-xl flex-col items-center justify-start gap-12 p-4">
      <div className="inline-flex flex-col items-start justify-start gap-8 self-stretch">
        <div className="inline-flex items-start justify-between self-stretch">
          <ProjectTitle title={project.name} subtitle={project.status} />
          <Toolbar />
        </div>
        <div className="relative w-full">
          <div className="relative mb-16 flex flex-row gap-8">
            <div className="relative inline-flex w-1/2 flex-col items-center justify-start gap-2">
              <ImageCarousel />
            </div>
            <div className="relative inline-flex w-1/2 flex-col items-start justify-start gap-2">
              <SkillScale projectSkills={project.projectSkills} />
            </div>
          </div>

          <div className="relative mb-16 flex flex-row gap-8">
            <Text description={project.description} />
          </div>

          <div className="relative mb-16 flex flex-row gap-8">
            <div className="relative inline-flex w-1/2 flex-col justify-start gap-2">
              <TeamMembers />
            </div>
            <div className="relative inline-flex w-1/2 flex-col items-start justify-start gap-2">
              <ProjectTimetable timetable={project.timetable} />
            </div>
          </div>
        </div>

        <div className="relative mb-16 flex flex-row gap-8">
          <div className="relative inline-flex w-1/2 flex-col justify-start">
            <ProjectIssuesList listOfIssues={project.issues} />
          </div>
          <div className="relative inline-flex w-1/2 flex-col justify-start">
            <Location
              location={{
                latitude: 51.023197847815915,
                longitude: 7.56205608469124,
              }}
            />
          </div>
        </div>

        <div className="relative mb-16 flex flex-row gap-8">
          <div className="relative inline-flex w-1/2 flex-col justify-start">
            <Links
              links={[
                {
                  label: 'Download Project Brief',
                  href: 'https://via.placeholder.com/32x32',
                  isDocument: true,
                },
                {
                  label: 'Download Project Brief',
                  href: 'https://via.placeholder.com/32x32',
                  isDocument: false,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
