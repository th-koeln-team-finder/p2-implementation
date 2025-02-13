import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { Resources } from '@/features/projects/components/Resources'
import { SkillScale } from '@/features/projects/components/SkillScale'
import TeamMembers from '@/features/projects/components/TeamMembers'
import { Toolbar } from '@/features/projects/components/Toolbar'
import { getProjectItem } from '@/features/projects/projects.queries'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { getTranslations } from 'next-intl/server'

export default async function Projects({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  const project = await getProjectItem(id)
  const translations = await getTranslations('projects')
  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="mx-auto inline-flex w-full max-w-screen-xl flex-col items-center justify-start gap-12 p-4">
      <div className="inline-flex items-start justify-between self-stretch">
        <ProjectTitle
          title={project.name}
          subtitle={project.phase ? translations('phase') + project.phase : ''}
        />
        <Toolbar />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <ImageCarousel />
        <SkillScale projectSkills={project.projectSkills} />

        <div className="col-span-2">
          {project.description && (
            <WysiwygRenderer value={project.description} />
          )}
        </div>

        <TeamMembers />

        {!!project.timetable.length && (
          <div className="relative inline-flex w-full flex-col items-start justify-start gap-2 lg:w-1/2">
            <ProjectTimetable timetable={project.timetable} />
          </div>
        )}

        {!!project.issues.length && (
          <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
            <ProjectIssuesList listOfIssues={project.issues} />
          </div>
        )}

        {!!project.resources.length && (
          <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
            <Resources resources={project.resources} />
          </div>
        )}
      </div>
    </div>
  )
}
