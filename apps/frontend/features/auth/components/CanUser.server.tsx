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
  fallback?: ReactNode
} & (Permissions[Obj][Action] extends never
  ? { data?: undefined }
  : { data: Permissions[Obj][Action] })

export async function CanUserServer<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>({
  target,
  action,
  data,
  children,
  fallback,
  // @ts-expect-error This technically has to return a promise, but TypeScript cannot handle async react components yet
}: PropsWithChildren<CanUserProps<Obj, Action>>): ReactNode {
  const session = await authMiddleware()
  // biome-ignore lint/suspicious/noExplicitAny: This is the correct type, TypeScript just doesn't know
  if (!hasPermission(session?.user, target, action, ...([data] as any)))
    return fallback
  return children
}
