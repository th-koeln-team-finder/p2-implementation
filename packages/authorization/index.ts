import type { RolesType } from '@repo/database/constants'
import type { UserSelect } from '@repo/database/schema'

type PermissionCheck<Data> =
  | boolean
  | ((user: UserSelect | undefined, data: Data) => boolean)

type RolesWithPermissions = {
  [Role in RolesType]: Partial<{
    [Obj in keyof Permissions]: Partial<{
      [Action in keyof Permissions[Obj]]: PermissionCheck<
        Permissions[Obj][Action]
      >
    }>
  }>
}

export type Permissions = {
  test: {
    view: never
    create: never
    delete: { id: number }
    'delete.all': never
    'become-admin': never
  }
}

export const PERMISSIONS = {
  'default-user': {
    test: {
      view: true,
      create: true,
      delete: (_, data) => data.id % 2 === 0,
      'delete.all': false,
      'become-admin': true,
    },
  },
  guest: {
    test: {
      view: true,
      create: false,
      'delete.all': false,
    },
  },
  admin: {
    test: {
      view: true,
      create: true,
      delete: true,
      'delete.all': true,
    },
  },
} as const satisfies RolesWithPermissions

export function hasPermission<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>(
  user: UserSelect | undefined,
  obj: Obj,
  action: Action,
  data = undefined as Permissions[Obj][Action],
) {
  const roles = user?.roles ?? (['guest'] as const)
  return roles.some((role: RolesType) => {
    const permission = (PERMISSIONS as RolesWithPermissions)[role][obj]?.[
      action
    ] as PermissionCheck<Permissions[Obj][Action]>
    if (permission === undefined) return false
    if (typeof permission === 'boolean') return permission
    return data !== undefined && permission(user, data)
  })
}
