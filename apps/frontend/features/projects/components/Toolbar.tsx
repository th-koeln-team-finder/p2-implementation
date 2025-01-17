import { Button } from '@repo/design-system/components/ui/button'
import { BookmarkIcon, LinkIcon, StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Toolbar({ stars }: { stars?: number }) {
  const t = useTranslations('projects')
  stars = stars || 13_000
  const starsString = stars.toLocaleString('en', { notation: 'compact' })

  return (
    <div className="flex flex-col items-center justify-end gap-0 lg:flex-row lg:gap-4">
      <div className="flex w-full items-center justify-end gap-4 lg:w-auto ">
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
      </div>
      <Button
        variant="default"
        size="default"
        className="ml-2 w-full lg:w-auto"
      >
        {t('join')}
      </Button>
    </div>
  )
}

//TODO Logik der einzelnen Buttons hinzufügen (Teilen, Merken etc.)
