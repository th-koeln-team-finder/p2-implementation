import type {
  ProjectMembershipsSelect,
  ProjectSelect,
} from '@repo/database/schema'
import { useOptimistic, useTransition } from 'react'

export type OptimisticPayload =
  | {
      action: 'add'
      values: {
        userId: string
        projectId?: string
        visible: boolean
        projectName: string
        projectJoinedDate: string
        projectLeftDate: string | null
        projectDescription: string
      }
    }
  | {
      action: 'delete'
      values: { id: string }
    }
  | {
      action: 'update'
      values: {
        id: string
        visible?: boolean
      }
    }

export function useOptimisticProjectMemberships(
  projectMemberships: (ProjectMembershipsSelect & {
    id: string
    project?: ProjectSelect | null
  })[],
) {
  const [_, startTransition] = useTransition()
  const [optimisticUpdates, dispatchOptimistic] = useOptimistic(
    projectMemberships,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'add': {
          const newUserProject = {
            id: Math.random().toString(),
            userId: payload.values.userId,
            projectId: payload.values.projectId || null,
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
