import type { ProjectSelect, UserProjectsSelect } from '@repo/database/schema'
import { useSession } from 'next-auth/react'
import { useOptimistic, useTransition } from 'react'

export type OptimisticPayload =
  | {
      action: 'add'
      values: {
        userId: string
        projectId: number
        visible: boolean
        projectName: string
        projectJoinedDate: string
        projectLeftDate: string
        projectDescription: string
      }
    }
  | {
      action: 'delete'
      values: { id: number }
    }
  | {
      action: 'update'
      values: {
        id: number
        visible?: boolean
      }
    }

export function useOptimisticUserProjects(
  userProjects: (UserProjectsSelect & {
    id: number
    project?: ProjectSelect | null
  })[],
) {
  const [_, startTransition] = useTransition()
  const [optimisticUpdates, dispatchOptimistic] = useOptimistic(
    userProjects,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'add': {
          const newUserProject = {
            id: Math.random(),
            userId: payload.values.userId,
            projectId: payload.values.projectId,
            visible: payload.values.visible,
            projectName: payload.values.projectName,
            projectJoinedDate: payload.values.projectJoinedDate,
            projectLeftDate: payload.values.projectLeftDate,
            projectDescription: payload.values.projectDescription,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          return [...state, newUserProject]
        }
        case 'update': {
          return state.map((userProject) => {
            if (userProject.id !== payload.values.id) {
              return userProject
            }

            return {
              ...userProject,
              visible: payload.values.visible ?? true,
            }
          })
        }
        case 'delete':
          return state.filter(
            (userProject) => userProject.id !== payload.values.id,
          )
        default:
          return state
      }
    },
  )
  return [
    optimisticUpdates,
    (payload: OptimisticPayload) =>
      startTransition(() => dispatchOptimistic(payload)),
  ] as const
}
