import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@repo/design-system/components/customCarousel'
import { Card, CardContent } from '@repo/design-system/components/ui/card'
import Image from 'next/image'
import {ProjectPictureSelect, type UploadedFileSelect} from "@repo/database/schema";
import {CreateProjectFormPictures} from "@/features/projects/projects.types";
/*
const carouselItems = Array.from({ length: 5 })
  .map((_, i) => `item-${i}`)
  .map((v) => (
    <CarouselItem key={v}>
      <Card>
        <CardContent className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg p-0">
          <Image
            className="h-full w-full object-cover"
            key={v}
            src="/images/image-placeholder.jpg"
            height={800}
            width={1200}
            alt="palm-trees"
          />
        </CardContent>
      </Card>
    </CarouselItem>
  ))

 */

export type ImageCarouselPicture={

    uploadedFile: UploadedFileSelect
    id?: string
    label: string

}


export default function ImageCarousel({
                                          images,
                                      }: {
    images?: ImageCarouselPicture[]
})
{
    let carouselItems=[]
    if(images) {
        console.log(images ? "Gibt Bilder" : "keine Bilder")
        carouselItems = images
            .map((image, index) => (

                <CarouselItem key={image.id}>
                    <Card>
                        <CardContent
                            className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg p-0">
                            <Image
                                className="h-full w-full object-cover"
                                key={image.id}
                                src="/images/image-placeholder.jpg"
                                height={800}
                                width={1200}
                                alt="palm-trees"
                            />
                        </CardContent>
                    </Card>
                </CarouselItem>
            ))
    }else{
         carouselItems.push(
                <CarouselItem key={0}>
                    <Card>
                        <CardContent className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg p-0">
                            <Image
                                className="h-full w-full object-cover"
                                key={0}
                                src="/images/image-placeholder.jpg"
                                height={800}
                                width={1200}
                                alt="palm-trees"
                            />
                        </CardContent>
                    </Card>
                </CarouselItem>
            )
    }
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
