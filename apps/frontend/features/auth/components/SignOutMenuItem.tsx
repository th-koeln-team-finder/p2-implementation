'use client'
import { clientSignOut, revalidateAll } from '@/features/auth/auth.actions'
import { useRouter } from '@/features/i18n/routing'
import { DropdownMenuItem } from '@repo/design-system/components/ui/dropdown-menu'
import { LogOutIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export function SignOutMenuItem() {
  const { update } = useSession()
  const router = useRouter()
  const translate = useTranslations()
  return (
    <DropdownMenuItem
      onClick={async () => {
        await update()
        await revalidateAll()
        router.replace('/')
        await clientSignOut()
      }}
      className="cursor-pointer"
    >
      <LogOutIcon />
      {translate('auth.logout.button')}
    </DropdownMenuItem>
  )
}
