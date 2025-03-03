'use client'

import {revalidateUserProjects, updateUserProject,} from '@/features/userProjects/userProjects.actions'
import type {OptimisticPayload} from '@/features/userProjects/userProjects.hooks'
import type {ProjectSelect, UserProjectsSelect} from '@repo/database/schema'
import {Button} from '@repo/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import {format} from 'date-fns'
import {Eye, EyeClosed, Trash2} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {useMemo} from 'react'

interface Project {
  id: number
  name: string
  description: string
  joinedDate: Date
  leftDate: Date | null
  visible: boolean
}

export default function ProjectList({
  userProjects,
  setProjectsOptimistic,
}: {
  userProjects: (UserProjectsSelect & { project?: ProjectSelect | null })[]
  setProjectsOptimistic: (payload: OptimisticPayload) => void
}) {
  const t = useTranslations()
  const handleDeleteProject = (id: string) => {
    setProjectsOptimistic({
      action: 'delete',
      values: { id },
    })
  }

  const updateProjectVisibility = async (id: string, visible: boolean) => {
    setProjectsOptimistic({
      action: 'update',
      values: {
        id,
        visible,
      },
    })
    await updateUserProject(id, { visible })
    await revalidateUserProjects()
  }

  const projects = useMemo(
    () =>
      userProjects.map((project) => ({
        id: project.id,
        name: project.projectName || project.project?.name || '',
        description:
          project.projectDescription || project.project?.description || '',
        joinedDate: new Date(project.projectJoinedDate ?? ''),
        leftDate: new Date(project.projectLeftDate ?? ''),
        visible: project.visible,
      })),
    [userProjects],
  )

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl">
        {t('users.settings.projects.yourProjects')}
      </h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {format(project.joinedDate, 'MMM yyyy')} -{' '}
                {project.leftDate
                  ? format(project.leftDate, 'MMM yyyy')
                  : 'Present'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                size="sm"
                variant={project.visible ? 'default' : 'outline'}
                onClick={() =>
                  updateProjectVisibility(project.id, !project.visible)
                }
              >
                {project.visible ? <EyeClosed /> : <Eye />}
                {project.visible
                  ? t('users.settings.projects.hideProject')
                  : t('users.settings.projects.showProject')}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="h-4 w-4" />{' '}
                {t('users.settings.projects.deleteProject')}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div>
          <h3 className="font-bold text-lg">
            {t('users.settings.projects.noProjectsDesc')}
          </h3>
        </div>
      )}
    </div>
  )
}
