// noinspection RequiredAttributes This is only for Webstorm, since the types seem to be too advanced for it

'use client'

import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { useRouter } from '@/features/i18n/routing'
import { toggleAdminRole } from '@/features/test/test.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { LockIcon, LockOpenIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function AddAdminRoleButton() {
  const router = useRouter()
  const session = useSession()
  return (
    <Button
      onClick={async () => {
        await toggleAdminRole()
        await session.update()
        router.replace('/')
      }}
      type="button"
      variant="secondary"
    >
      <CanUserClient
        target="test"
        action="become-admin"
        fallback={<LockOpenIcon />}
      >
        <LockIcon />
      </CanUserClient>
      Toggle Admin Role
    </Button>
  )
}
