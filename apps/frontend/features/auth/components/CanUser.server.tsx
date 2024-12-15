import 'server-only'
import { authMiddleware } from '@/auth'
import { type Permissions, hasPermission } from '@repo/authorization'
import type { UserSelect } from '@repo/database/schema'
import type { PropsWithChildren, ReactNode } from 'react'

type CanUserProps<Obj extends keyof Permissions> = {
  target: Obj
  action: Permissions[Obj]['action']
  data?: Permissions[Obj]['dataType']
}

export async function CanUserServer<Obj extends keyof Permissions>({
  target,
  action,
  data,
  children,
  // @ts-expect-error This technically has to return a promise, but TypeScript cannot handle async react components yet
}: PropsWithChildren<CanUserProps<Obj>>): ReactNode {
  const session = await authMiddleware()
  if (!session?.user) return null
  if (!hasPermission(session.user as UserSelect, target, action, data))
    return null
  return children
}
