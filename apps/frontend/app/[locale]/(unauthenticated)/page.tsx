// noinspection RequiredAttributes This is only for Webstorm, since the types seem to be too advanced for it

import { Link } from '@/features/i18n/routing'
import {
  ImageCard,
  ImageCardContent,
  ImageCardFooter,
  ImageCardTitle,
} from '@repo/design-system/components/custom/image-card'
import { Button } from '@repo/design-system/components/ui/button'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const translate = await getTranslations()
  return (
    <div className="continer container mx-auto grid flex-1 grid-cols-1 gap-4 px-4 pb-8 md:grid-cols-2">
      <ImageCard imageUrl="/images/find-a-project-2.jpg" className="w-full">
        <ImageCardTitle>{translate('home.cardFind.title')}</ImageCardTitle>
        <ImageCardContent>
          <p>{translate('home.cardFind.content')}</p>
        </ImageCardContent>
        <ImageCardFooter>
          <Link href="/projects" className="mx-auto">
            <Button>{translate('home.cardFind.button')}</Button>
          </Link>
        </ImageCardFooter>
      </ImageCard>
      <ImageCard imageUrl="/images/create-a-project.jpg" className="w-full">
        <ImageCardTitle>{translate('home.cardCreate.title')}</ImageCardTitle>
        <ImageCardContent>
          <p>{translate('home.cardCreate.content')}</p>
        </ImageCardContent>

        <ImageCardFooter>
          <Link href="/projects/create" className="mx-auto">
            <Button>{translate('home.cardCreate.button')}</Button>
          </Link>
        </ImageCardFooter>
      </ImageCard>
      <ImageCard
        imageUrl="/images/brainstorm-2.jpg"
        className="w-full md:col-span-2"
        cardFull={true}
      >
        <div className="flex w-full flex-col justify-between gap-4 lg:mr-48 lg:w-1/2 lg:gap-8">
          <ImageCardTitle>
            {translate('home.cardBrainstorm.title')}
          </ImageCardTitle>
          <ImageCardContent>
            <p>{translate('home.cardBrainstorm.content')}</p>
          </ImageCardContent>
        </div>
        <div className="flex w-full flex-col justify-center lg:w-1/2">
          <Link href="/brainstorm" className="mx-auto">
            <Button>{translate('home.cardBrainstorm.button')}</Button>
          </Link>
        </div>
      </ImageCard>
    </div>
  )
}
