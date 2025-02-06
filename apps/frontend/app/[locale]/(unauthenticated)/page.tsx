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
    <div className="container mx-auto my-4 max-w-screen-xl px-4">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ImageCard imageUrl="/images/find-a-project-2.jpg">
            <ImageCardTitle>{translate('home.cardFind.title')}</ImageCardTitle>
            <ImageCardContent>
              <p>{translate('home.cardFind.content')}</p>
            </ImageCardContent>
            <ImageCardFooter>
              <Link href="/find-project" className="mx-auto">
                <Button>{translate('home.cardFind.button')}</Button>
              </Link>
            </ImageCardFooter>
          </ImageCard>
        </div>
    <div className="container mx-auto my-4 max-w-screen-xl px-4">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ImageCard imageUrl="/images/find-a-project-2.jpg">
            <ImageCardTitle>{translate('home.cardFind.title')}</ImageCardTitle>
            <ImageCardContent>
              <p>{translate('home.cardFind.content')}</p>
            </ImageCardContent>
            <ImageCardFooter>
              <Link href="/find-project" className="mx-auto">
                <Button>{translate('home.cardFind.button')}</Button>
              </Link>
            </ImageCardFooter>
          </ImageCard>
        <div className="w-full lg:w-1/2">
          <ImageCard imageUrl="/images/create-a-project.jpg">
            <ImageCardTitle>
              {translate('home.cardCreate.title')}
            </ImageCardTitle>
            <ImageCardContent>
              <p>{translate('home.cardCreate.content')}</p>
            </ImageCardContent>

            <ImageCardFooter>
              <Link href="/create-project" className="mx-auto">
                <Button>{translate('home.cardCreate.button')}</Button>
              </Link>
            </ImageCardFooter>
          </ImageCard>
        </div>
      </div>
      <div className="flex">
        <div className="w-full">
          <ImageCard
            imageUrl="/images/brainstorm-2.jpg"
            className="flex flex-col gap-4 lg:flex-row"
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
      </div>
    </div>
  )
}
