import type {SkillsSelect, UserSkillsSelect, UserSkillVerificationSelect,} from '@repo/database/schema'
import {useOptimistic, useTransition} from 'react'

export type OptimisticPayload =
  | {
      action: 'add'
      values: {
        userId: string
        skillId: string
        level: number
        skill: {
          id: string
          skill: string
        }
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
        level: number
      }
    }

export function useOptimisticUserSkills(
  userSkills: (UserSkillsSelect & {
    id: string
    skill?: Partial<SkillsSelect>
    userSkillVerification?: Partial<UserSkillVerificationSelect>[]
  })[],
) {
  const [_, startTransition] = useTransition()
  const [optimisticUpdates, dispatchOptimistic] = useOptimistic(
    userSkills,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'add': {
          const newUserSkill = {
            id: Math.random().toString(),
            userId: payload.values.userId,
            skillId: payload.values.skillId,
            level: payload.values.level,
            skill: {
              id: payload.values.skillId,
              skill: payload.values.skill?.skill,
            },
            userSkillVerification: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          return [...state, newUserSkill]
        }
        case 'update': {
          return state.map((userSkill) => {
            if (userSkill.id !== payload.values.id) {
              return userSkill
            }

            return {
              ...userSkill,
              level: payload.values.level,
            }
          })
        }
        case 'delete':
          return state.filter((userSkill) => userSkill.id !== payload.values.id)
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
