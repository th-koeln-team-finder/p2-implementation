import { type Permissions, hasPermission } from '@repo/authorization'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export function useSessionPermission<
  Obj extends keyof Permissions,
  Action extends keyof Permissions[Obj],
>(
  target: Obj,
  action: Action,
  ...data: ConditionalMethodParam<Permissions[Obj][Action]>
) {
  const { data: session } = useSession()
  const user = session?.user
  return useMemo(
    () => hasPermission(user, target, action, ...data),
    [user, target, action, data],
  )
}

type ConditionalMethodParam<Value> = Value extends never ? [] : [Value]
