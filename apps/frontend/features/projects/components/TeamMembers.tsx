import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/design-system/components/customCarousel'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const carouselItems = Array.from({ length: 10 })
  .map((_, i) => `item-${i}`)
  .map((v) => (
    <CarouselItem key={v} className="flex basis-1/3 flex-col md:basis-1/6">
      <div className="flex items-center justify-center overflow-hidden rounded-full">
        <Image
          src="/images/image-placeholder-square.jpg"
          height={800}
          width={800}
          alt="palm-trees"
          style={{ aspectRatio: 1 }}
        />
      </div>

      <span className="mx-auto text-base">{v}</span>
    </CarouselItem>
  ))

export default function TeamMembers() {
  const t = useTranslations('projects')

  return (
    <div>
      <h2 className="mb-2 font-medium text-2xl">{t('team.title')}</h2>
      <div className="px-4">
        <Carousel>
          <CarouselContent>{carouselItems}</CarouselContent>
          <CarouselPrevious className="-left-8 muted-foreground-500 border-none bg-transparent hover:bg-transparent hover:text-primary [&_svg]:size-8 [&_svg]:stroke-1" />
          <CarouselNext className="-right-8 muted-foreground-500 border-none bg-transparent hover:bg-transparent hover:text-primary [&_svg]:size-8 [&_svg]:stroke-1" />
        </Carousel>
      </div>
    </div>
  )
}

//TODO CarouselItem Daten einlesen
