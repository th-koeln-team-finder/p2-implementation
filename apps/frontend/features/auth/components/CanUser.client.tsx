'use client'
import { type Permissions, hasPermission } from '@repo/authorization'
import type { UserSelect } from '@repo/database/schema'
import { useSession } from 'next-auth/react'
import type { PropsWithChildren, ReactNode } from 'react'

type CanUserProps<Obj extends keyof Permissions> = {
  target: Obj
  action: Permissions[Obj]['action']
  data?: Permissions[Obj]['dataType']
  fallback?: ReactNode
}

export function CanUserClient<Obj extends keyof Permissions>({
  target,
  action,
  data,
  children,
  fallback,
}: PropsWithChildren<CanUserProps<Obj>>): ReactNode {
  const { data: session } = useSession()
  if (!session?.user) return fallback
  console.log(
    'session',
    session.user,
    target,
    action,
    hasPermission(session.user as UserSelect, target, action, data),
  )
  if (!hasPermission(session.user as UserSelect, target, action, data))
    return fallback
  return children
}
