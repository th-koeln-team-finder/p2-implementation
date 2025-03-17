'use client'

import { pinApplication } from '@/features/Application/applications.actions'
import type { ProjectApplicationSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import { PinIcon, PinOffIcon } from 'lucide-react'
import { useState } from 'react'

export default function ApplicationListPin({
  application,
}: { application: ProjectApplicationSelect }) {
  const [isPinned, setIsPinned] = useState(application.isPinned)
  const togglePin = () => {
    setIsPinned(!isPinned)
    pinApplication(application.id, !isPinned).catch((reason) => {
      setIsPinned(!isPinned)
      console.error(reason)
    })
  }

  return (
    <Button variant="ghost" size="icon" className="min-w-9" onClick={togglePin}>
      {isPinned ? <PinOffIcon className='fill-foreground' size={24} /> : <PinIcon size={24} />}
    </Button>
  )
}
