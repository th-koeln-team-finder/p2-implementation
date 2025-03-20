import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@repo/design-system/components/customCarousel'
import { Card, CardContent } from '@repo/design-system/components/ui/card'
import Image from 'next/image'

export default function CreateProjectPicturePreviewCarousel({
  images,
}: {
  images: string[]
  progressState?: Record<string, number>
}) {
  return (
    <Carousel
      autoplay
      autoplayInterval={5000}
      className="w-full"
      opts={{ align: 'start', loop: true }}
    >
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image}>
            <div className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg">
              <Image
                className="h-full w-full object-contain"
                src={image}
                height={800}
                width={1200}
                alt="palm-trees"
              />
            </div>
          </CarouselItem>
        ))}
        {!images.length && (
          <CarouselItem>
            <Card>
              <CardContent className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg p-0">
                <Image
                  className="h-full w-full object-cover"
                  src="/images/image-placeholder.jpg"
                  height={800}
                  width={1200}
                  alt="palm-trees"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPagination items={images} />
    </Carousel>
  )
}
