import { authMiddleware } from '@/auth'
import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectResource } from '@/features/projects/components/ProjectResource'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import TeamMembers from '@/features/projects/components/TeamMembers'
import { Toolbar } from '@/features/projects/components/Toolbar'
import { getProjectItem } from '@/features/projects/projects.queries'
import { SkillScale } from '@/features/skills/components/SkillScale'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { getTranslations } from 'next-intl/server'


export default async function Projects({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  const session = await authMiddleware()
  const project = await getProjectItem(id, session?.user?.id)
  const translations = await getTranslations('projects')

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="mx-auto inline-flex w-full max-w-screen-xl flex-col items-center justify-start gap-12 p-4">
      <div className="inline-flex items-start justify-between self-stretch">
        <ProjectTitle
          title={project.name}
          subtitle={
            project.phase ? `${translations('phase')}: ${project.phase}` : ''
          }
        />
        <Toolbar project={project}/>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ImageCarousel />
        <SkillScale skills={project.projectSkills} />

        <div className="md:col-span-2">
          {project.description && (
            <WysiwygRenderer value={project.description} />
          )}
        </div>


        <TeamMembers participants={project.participants} />

        {!!project.timetable.length && (
          <ProjectTimetable timetable={project.timetable} />
        )}

        {!!project.issues.length && (
          <ProjectIssuesList listOfIssues={project.issues} />
        )}

        {!!project.resources.length && (
          <div className="flex flex-col gap-1">
            <h2 className="mb-2 font-medium text-2xl">
              {translations('links')}
            </h2>
            {project.resources.map((res) => (
              <ProjectResource key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
