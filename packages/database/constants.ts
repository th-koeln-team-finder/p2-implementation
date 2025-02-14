import {boolean} from "drizzle-orm/pg-core";

export const Roles = {
  admin: 'admin',
  defaultUser: 'default-user',
  guest: 'guest',
} as const

export const RolesValues = Object.values(
  Roles,
) as (typeof Roles)[keyof typeof Roles][]

export type RolesType = (typeof Roles)[keyof typeof Roles]

const notificationChannels = ['email', 'push'] as const
export const notificationTypes = {
  projects: [
    'projectUpdated',
    'memberJoinedProject',
    'memberLeftProject',
    'newApplication',
    'bookmarkedProjectUpdated',
  ],
  profile: ['newFollower', 'newInvite', 'newSkillEvaluation'],
}
export const notificationColumns = [
  ...notificationTypes.projects,
  ...notificationTypes.profile,
].reduce(
  (acc, type) => {
    for (const channel of notificationChannels) {
      const columnName = `${type}_${channel}`
      acc[columnName] = boolean(columnName)
    }
    return acc
  },
  {} as Record<string, ReturnType<typeof boolean>>,
)