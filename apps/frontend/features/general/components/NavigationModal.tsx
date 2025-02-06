'use client'

import { useRouter } from '@/features/i18n/routing'
import { Dialog } from '@repo/design-system/components/ui/dialog'
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

const NavigationModalContext = createContext({
  blockBackNavigation: false,
  setBlockBackNavigation: (_block: boolean) => {},
})

export const useNavigationModalContext = () => {
  return useContext(NavigationModalContext)
}

export function NavigationModal({ children }: PropsWithChildren) {
  const router = useRouter()
  const [blockBackNavigation, setBlockBackNavigation] = useState(false)
  return (
    <NavigationModalContext.Provider
      value={{ blockBackNavigation, setBlockBackNavigation }}
    >
      <Dialog
        open
        onOpenChange={(open) => {
          if (open || blockBackNavigation) return
          router.back()
        }}
      >
        {children}
      </Dialog>
    </NavigationModalContext.Provider>
  )
}
