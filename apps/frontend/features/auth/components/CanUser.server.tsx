import 'server-only'
import { authMiddleware } from '@/auth'
import { type Permissions, hasPermission } from '@repo/authorization'
import type { PropsWithChildren, ReactNode } from 'react'

type CanUserProps<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
> = {
  target: Obj
  action: Action
  data?: Permissions[Obj][Action]
  fallback?: ReactNode
}

export async function CanUserServer<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>({
  target,
  action,
  data = undefined as Permissions[Obj][Action],
  children,
  fallback,
  // @ts-expect-error This technically has to return a promise, but TypeScript cannot handle async react components yet
}: PropsWithChildren<CanUserProps<Obj, Action>>): ReactNode {
  const session = await authMiddleware()
  if (!hasPermission(session?.user, target, action, data)) return fallback
  return children
}
