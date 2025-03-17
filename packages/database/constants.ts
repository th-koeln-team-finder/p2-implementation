import { boolean } from 'drizzle-orm/pg-core'
import type { PgBooleanBuilderInitial } from 'drizzle-orm/pg-core/columns/boolean'

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

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export const notificationTypesByCategory: {
  projects: [
    'projectUpdated',
    'memberJoinedProject',
    'membershipAccepted',
    'memberLeftProject',
    'newApplication',
    'bookmarkedProjectUpdated',
  ]
  profile: ['newFollower', 'newInvite', 'newSkillEvaluation']
} = {
  projects: [
    'projectUpdated',
    'memberJoinedProject',
    'membershipAccepted',
    'memberLeftProject',
    'newApplication',
    'bookmarkedProjectUpdated',
  ],
  profile: ['newFollower', 'newInvite', 'newSkillEvaluation'],
}

export type NotificationType =
  | ArrayElement<typeof notificationTypesByCategory.projects>
  | ArrayElement<typeof notificationTypesByCategory.profile>

type NotificationChannel = (typeof notificationChannels)[number]

export type NotificationColumn = `${NotificationType}_${NotificationChannel}`

export const notificationColumns = [
  ...notificationTypesByCategory.projects,
  ...notificationTypesByCategory.profile,
].reduce(
  (acc, type) => {
    for (const channel of notificationChannels) {
      const columnName: NotificationColumn = `${type}_${channel}`
      acc[columnName] = boolean(columnName).default(true)
    }
    return acc
  },
  {} as Record<NotificationColumn, PgBooleanBuilderInitial<NotificationColumn>>,
)
