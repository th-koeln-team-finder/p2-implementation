import { FilePreview } from '@/features/file-upload/components/FilePreview'
import type { UploadedFileSelect } from '@repo/database/schema'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@repo/design-system/components/customCarousel'
import { Card, CardContent } from '@repo/design-system/components/ui/card'
import Image from 'next/image'

export type ImageCarouselPicture = {
  uploadedFile?: UploadedFileSelect | null
  id: string
}

export default function ImageCarousel({
  images,
}: {
  images: ImageCarouselPicture[]
}) {
  return (
    <Carousel
      autoplay
      autoplayInterval={5000}
      className="w-full"
      opts={{ align: 'start', loop: true }}
    >
      <CarouselContent>
        {images
          .filter((i) => i.uploadedFile)
          .map((image) => (
            <CarouselItem key={image.id}>
              <div className="flex aspect-auto h-64 items-center justify-center overflow-hidden rounded-lg">
                <FilePreview
                  file={image.uploadedFile as UploadedFileSelect}
                  className="h-full w-full object-contain"
                  height={800}
                  width={1200}
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
