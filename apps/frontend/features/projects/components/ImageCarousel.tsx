import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@repo/design-system/components/customCarousel'
import { Card, CardContent } from '@repo/design-system/components/ui/card'

const carouselItems = Array.from({ length: 5 })
  .map((_, i) => `item-${i}`)
  .map((v) => (
    <CarouselItem key={v}>
      <Card>
        <CardContent className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg p-0">
          <img
            src="https://cdn.pixabay.com/photo/2018/01/03/17/05/palm-trees-3058728_1280.jpg"
            alt=""
          />
        </CardContent>
      </Card>
    </CarouselItem>
  ))

export default function ImageCarousel() {
  return (
    <Carousel
      autoplay
      autoplayInterval={5000}
      className="w-full"
      opts={{ align: 'start', loop: true }}
    >
      <CarouselContent>{carouselItems}</CarouselContent>
      {<CarouselPagination items={carouselItems} />}
    </Carousel>
  )
}

//TODO CarouselItem Daten einlesen
