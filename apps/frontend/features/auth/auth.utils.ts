import { authMiddleware } from '@/auth'
import { type Permissions, hasPermission } from '@repo/authorization'

export async function hasSessionPermission<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>(
  target: Obj,
  action: Action,
  ...data: Permissions[Obj][Action] extends never
    ? []
    : [Permissions[Obj][Action]]
) {
  const session = await authMiddleware()
  return hasPermission(session?.user, target, action, ...data)
}
