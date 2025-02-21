'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronUpIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export function ScrollTopButton() {
  const [showScroll, setShowScroll] = useState(false)
  useEffect(() => {
    function checkScrollTop() {
      setShowScroll(
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20,
      )
    }
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  })
  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  return (
    <div className="fixed bottom-0 left-0 p-4">
      <Button
        className={cn('opacity-0 transition-all', showScroll && 'opacity-100')}
        size="icon"
        onClick={scrollTop}
      >
        <ChevronUpIcon className="size-6" />
      </Button>
    </div>
  )
}
