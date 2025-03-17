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
    view: { createdById: string | null }
    update: {
      createdById: string | null
    }
    delete: {
      createdById: string | null
      brainstorm?: { createdById: string | null } | undefined
    }
    pin: {
      brainstorm?: { createdById: string | null } | undefined
      parentCommentId: string | null
    }
    reply: {
      parentCommentId: string | null
    }
    like: never
  }
  applyProject: {
    view: never
    create: { createdById: string | null }
    update: { createdById: string | null }
    delete: { createdById: string | null }
  }
  project: {
    'view.all': never
    'view.detail': never
    create: never
    delete?: { createdById: string | null }
    update?: { createdById: string | null }
  }
  projectApplication: {
    view: { createdById: string | null }
    accept: { createdById: string | null }
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
      pin: (user, data) =>
        !data.parentCommentId && user?.id === data.brainstorm?.createdById,
      reply: (_, data) => !data.parentCommentId,
      like: true,
    },
    project: {
      'view.all': true,
      'view.detail': true,
      create: true,
      delete: (user, data) => data?.createdById === user?.id,
      update: (user, data) => data?.createdById === user?.id,
    },
    applyProject: {
      create: (user, data) => data.createdById !== user?.id,
      update: (user, data) => data.createdById === user?.id,
      delete: (user, data) => data.createdById === user?.id,
    },
    projectApplication: {
      view: (user, data) => data.createdById === user?.id,
      accept: (user, data) => data.createdById === user?.id,
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
      'view.detail': true,
    },
    commentBrainstorm: {
      view: false,
    },
    project: {
      'view.all': true,
      'view.detail': true,
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
      pin: (_, data) => !data.parentCommentId,
      reply: (_, data) => !data.parentCommentId,
      like: true,
    },
    applyProject: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    project: {
      'view.all': true,
      'view.detail': true,
      create: true,
      delete: true,
      update: true,
    },
    projectApplication: {
      view: true,
      accept: true,
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
  ...data: ConditionalMethodParam<Permissions[Obj][Action]>
) {
  const roles = user?.roles ?? ['guest']
  return roles.some((role: RolesType) => {
    const permission = (PERMISSIONS as RolesWithPermissions)[role][obj]?.[
      action
    ] as PermissionCheck<Permissions[Obj][Action]>
    if (permission === undefined) return false
    if (typeof permission === 'boolean') return permission
    return (
      data !== undefined &&
      permission(user, data?.[0] as Permissions[Obj][Action])
    )
  })
}

type ConditionalMethodParam<Value> = Value extends never ? [] : [Value]
