import {useSession} from "next-auth/react";
import {useOptimistic, useTransition} from "react";
import {SkillsSelect, UserSkillsInsert, UserSkillsSelect} from "@repo/database/schema";

export type OptimisticPayload =
  | {
  action: 'add'
  values: {
    userId: string,
    skillId: number,
    level: number,
    skill: {
      id: number,
      skill: string
    }
  }
}
  | {
  action: 'delete'
  values: { id: number }
}
  | {
  action: 'update'
  values: {
    id: number,
    level: number
  }
}

export function useOptimisticUserSkills(userSkills: (UserSkillsSelect & {id: number, skill?: Partial<SkillsSelect>})[]) {
  const { data: session } = useSession()
  const [_, startTransition] = useTransition()
  const [optimisticUpdates, dispatchOptimistic] = useOptimistic(
    userSkills,
    (state, payload: OptimisticPayload) => {
      switch (payload.action) {
        case 'add': {
          const newUserSkill = {
            id: Math.random(),
            userId: payload.values.userId,
            skillId: payload.values.skillId,
            level: payload.values.level,
            skill: {
              id: payload.values.skillId,
              skill: payload.values.skill?.skill,
            },
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
              updatedAt: new Date(),
            }
          })
        }
        case 'delete':
          return state.filter(
            (userSkill) => userSkill.id !== payload.values.id
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
