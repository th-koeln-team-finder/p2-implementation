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
  // TODO The whiteboard interactions need to be added here
  brainstorm: {
    'view.all': never
    create: never
    'view.detail': never
    delete: { createdById: string }
    update: { createdById: string }
  }
  commentBrainstorm: {
    create: never
    view: { createdById: string }
    update: {
      createdById: string
    }
    delete: {
      createdById: string
      brainstorm?: { createdById: string }
    }
    pin: {
      createdById: string
    }
    reply: {
      parentCommentId: string | null
    }
    like: never
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
    brainstorm: {
      'view.all': true,
      'view.detail': true,
      create: true,
      update: (user, data) => data.createdById === user?.id,
      delete: (user, data) => data.createdById === user?.id,
    },
    commentBrainstorm: {
      view: true,
      create: true,
      update: (user, data) => data.createdById === user?.id,
      delete: (user, data) =>
        data.createdById === user?.id ||
        data.brainstorm?.createdById === user?.id,
      pin: (user, data) => user?.id === data.createdById,
      reply: (_, data) => !data.parentCommentId,
      like: true,
    },
  },
  guest: {
    test: {
      view: true,
      create: false,
      'delete.all': false,
    },
    brainstorm: {
      'view.all': true,
      'view.detail': false,
    },
    commentBrainstorm: {
      view: false,
    },
  },
  admin: {
    test: {
      view: true,
      create: true,
      delete: true,
      'delete.all': true,
    },
    brainstorm: {
      'view.all': true,
      'view.detail': true,
      create: true,
      update: true,
      delete: true,
    },
    commentBrainstorm: {
      view: true,
      create: true,
      update: true,
      delete: true,
      pin: true,
      reply: (_, data) => !data.parentCommentId,
      like: true,
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
  const roles = user?.roles ?? ['guest']
  return roles.some((role: RolesType) => {
    const permission = (PERMISSIONS as RolesWithPermissions)[role][obj]?.[
      action
    ] as PermissionCheck<Permissions[Obj][Action]>
    if (permission === undefined) return false
    if (typeof permission === 'boolean') return permission
    return data !== undefined && permission(user, data)
  })
}
