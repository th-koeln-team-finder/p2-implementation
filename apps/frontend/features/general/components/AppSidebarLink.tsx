'use client'

import { Link } from '@/features/i18n/routing'
import { useSidebar } from '@repo/design-system/components/ui/sidebar'
import type { PropsWithChildren } from 'react'

export function AppSidebarLink({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  const { setOpenMobile } = useSidebar()
  return (
    <Link href={href} onClick={() => setOpenMobile(false)}>
      {children}
    </Link>
  )
}
