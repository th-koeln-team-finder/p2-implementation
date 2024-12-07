import { Button } from '@repo/design-system/components/ui/button'
import { BookmarkIcon, LinkIcon, StarIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function Toolbar({ stars }: { stars?: number }) {
  const t = await getTranslations('projects')
  stars = stars || 13_000
  const starsString = stars.toLocaleString('en', { notation: 'compact' })

  return (
    <div className="justify-end items-center gap-2 flex">
      <Button variant="ghost">
        {starsString}
        <StarIcon />
      </Button>
      <Button variant="ghost" size="icon">
        <LinkIcon />
      </Button>
      <Button variant="ghost" size="icon">
        <BookmarkIcon />
      </Button>
      <Button variant="default" size="default">
        {t('join')}
      </Button>
    </div>
  )
}
