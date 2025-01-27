'use client'
import { type Permissions, hasPermission } from '@repo/authorization'
import { useSession } from 'next-auth/react'
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

export function CanUserClient<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>({
  target,
  action,
  data,
  children,
  fallback,
}: PropsWithChildren<CanUserProps<Obj, Action>>): ReactNode {
  const { data: session } = useSession()
  // biome-ignore lint/suspicious/noExplicitAny: This is the correct type, TypeScript just doesn't know
  if (!hasPermission(session?.user, target, action, ...([data] as any)))
    return fallback
  return children
}
