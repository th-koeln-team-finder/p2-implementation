import { authMiddleware } from '@/auth'
import { type Permissions, hasPermission } from '@repo/authorization'
import type { UserSelect } from '@repo/database/schema'

export async function hasSessionPermission<Obj extends keyof Permissions>(
  target: Obj,
  action: Permissions[Obj]['action'],
  data?: Permissions[Obj]['dataType'],
) {
  const session = await authMiddleware()
  if (!session?.user) return false
  return hasPermission(session.user as UserSelect, target, action, data)
}
