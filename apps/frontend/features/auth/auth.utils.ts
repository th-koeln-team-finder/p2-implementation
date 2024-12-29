import { authMiddleware } from '@/auth'
import { type Permissions, hasPermission } from '@repo/authorization'
import type { UserSelect } from '@repo/database/schema'

export async function hasSessionPermission<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>(target: Obj, action: Action, data = undefined as Permissions[Obj][Action]) {
  const session = await authMiddleware()
  if (!session?.user) return false
  return hasPermission(session.user as UserSelect, target, action, data)
}
