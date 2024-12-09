export const Roles = {
  admin: 'admin',
  defaultUser: 'default-user',
  guest: 'guest',
} as const

export const RolesValues = Object.values(
  Roles,
) as (typeof Roles)[keyof typeof Roles][]

export type RolesType = (typeof Roles)[keyof typeof Roles]
