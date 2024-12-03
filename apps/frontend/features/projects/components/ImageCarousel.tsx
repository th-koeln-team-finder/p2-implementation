import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@repo/design-system/components/ui/carousel";
import {Card, CardContent} from "@repo/design-system/components/ui/card";


const carouselItems = Array.from({ length: 5 })
        .map((_, i) => `item-${i}`)
        .map((v) => (
            <CarouselItem key={v}>
                    <Card>
                        <CardContent className="flex aspect-auto h-64 p-0 items-center justify-center overflow-hidden rounded-lg">
                            <img src="https://cdn.pixabay.com/photo/2018/01/03/17/05/palm-trees-3058728_1280.jpg"/>
                        </CardContent>
                    </Card>
            </CarouselItem>
        ))

export default function ImageCarousel() {
    return (

        <Carousel className="w-full" opts={{align: "start", loop: true,}}>
            <CarouselContent>{carouselItems}</CarouselContent>
        </Carousel>
    )
}

//TODO Bullets statt Arrow Buttons (& Autoplay?)