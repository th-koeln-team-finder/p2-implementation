import type { RolesType } from '@repo/database/constants'
import type { UserSelect } from '@repo/database/schema'

type PermissionCheck<Permission extends keyof Permissions> =
  | boolean
  | ((user: UserSelect, data: Permissions[Permission]['dataType']) => boolean)

type RolesWithPermissions = {
  [Role in RolesType]: Partial<{
    [Obj in keyof Permissions]: Partial<{
      [Action in Permissions[Obj]['action']]: PermissionCheck<Obj>
    }>
  }>
}

export type Permissions = {
  test: {
    dataType: { id: number }
    action: 'view' | 'create' | 'delete' | 'delete.all' | 'become-admin'
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

export function hasPermission<Obj extends keyof Permissions>(
  user: UserSelect,
  obj: Obj,
  action: Permissions[Obj]['action'],
  data?: Permissions[Obj]['dataType'],
) {
  return user.roles.some((role: RolesType) => {
    const permission = (PERMISSIONS as RolesWithPermissions)[role][obj]?.[
      action
    ] as PermissionCheck<Obj>
    if (permission === undefined) return false
    if (typeof permission === 'boolean') return permission
    return data !== undefined && permission(user, data)
  })
}
