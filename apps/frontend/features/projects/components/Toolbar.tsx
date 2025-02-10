import { Button } from '@repo/design-system/components/ui/button'
import { BookmarkIcon, LinkIcon, StarIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function Toolbar({ stars }: { stars?: number }) {
  const t = await getTranslations('projects')
  stars = stars || 13_000
  const starsString = stars.toLocaleString('en', { notation: 'compact' })

  return (
    <div className="justify-end items-center gap-4 flex">
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
