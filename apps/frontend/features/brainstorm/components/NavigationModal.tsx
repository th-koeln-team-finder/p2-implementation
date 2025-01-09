'use client'

import { useRouter } from '@/features/i18n/routing'
import { Dialog } from '@repo/design-system/components/ui/dialog'
import type { PropsWithChildren } from 'react'

export function NavigationModal({ children }: PropsWithChildren) {
  const router = useRouter()
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (open) return
        router.back()
      }}
    >
      {children}
    </Dialog>
  )
}
