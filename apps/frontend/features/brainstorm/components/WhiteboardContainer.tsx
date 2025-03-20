'use client'

import { useRef, useState } from 'react'
import { MaximizeIcon, MinimizeIcon } from 'lucide-react'
import { SyncedWhiteboard } from '@repo/design-system/components/whiteboard'
import { Button } from '@repo/design-system/components/ui/button'

type WhiteboardContainerProps = {
  roomId: string
  user: { id: string; name: string } | null
}

export function WhiteboardContainer({
  roomId,
  user,
}: WhiteboardContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const whiteboardRef = useRef(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      whiteboardRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      ref={whiteboardRef}
      className={`relative grid h-[36rem] min-h-[36rem] w-full place-items-center rounded border border-border bg-white ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : ''
      }`}
    >
      <Button
        variant="secondary"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute right-1 bottom-12 z-[999]"
      >
        {isFullscreen ? <MinimizeIcon size={20} /> : <MaximizeIcon size={20} />}
      </Button>
      <SyncedWhiteboard className="rounded" roomId={roomId} user={user} />
    </div>
  )
}
