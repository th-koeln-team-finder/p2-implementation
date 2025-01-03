'use client'
import { type Permissions, hasPermission } from '@repo/authorization'
import type { UserSelect } from '@repo/database/schema'
import { useSession } from 'next-auth/react'
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

export function CanUserClient<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>({
  target,
  action,
  data = undefined as Permissions[Obj][Action],
  children,
  fallback,
}: PropsWithChildren<CanUserProps<Obj, Action>>): ReactNode {
  const { data: session } = useSession()
  if (!session?.user) return fallback
  if (!hasPermission(session.user as UserSelect, target, action, data))
    return fallback
  return children
}