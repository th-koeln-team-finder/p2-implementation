import { Button } from '@repo/design-system/components/ui/button'
import { BookmarkIcon, LinkIcon, StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Toolbar({ stars }: { stars?: number }) {
  const t = useTranslations('projects')
  stars = stars || 13_000
  const starsString = stars.toLocaleString('en', { notation: 'compact' })

  return (
    <div className="flex items-center justify-end gap-4">
      <Button variant="ghost" className="p-0">
        <div className="my-auto leading-normal">{starsString}</div>
        <StarIcon />
      </Button>
      <Button variant="ghost" size="icon" className="h-fit w-fit">
        <LinkIcon />
      </Button>
      <Button variant="ghost" size="icon" className="h-fit w-fit">
        <BookmarkIcon />
      </Button>
      <Button variant="default" size="default" className="ml-2">
        {t('join')}
      </Button>
    </div>
  )
}

//TODO Logik der einzelnen Buttons hinzufügen (Teilen, Merken etc.)
