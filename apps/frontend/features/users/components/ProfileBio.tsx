'use client'

import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function ProfileBio({ bio }: { bio: string }) {
  const [bioOpened, setBioOpened] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          `h-24 overflow-hidden transition ${bioOpened ? 'h-auto' : ''}`,
        )}
      >
        <WysiwygRenderer value={bio} renderAsString />
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setBioOpened(!bioOpened)}
      >
        <span
          className={`text-primary transition ${bioOpened ? 'rotate-180 transform' : ''}`}
        >
          <ChevronDown />
        </span>
      </Button>
    </div>
  )
}
