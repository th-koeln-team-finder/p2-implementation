import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@repo/design-system/components/ui/carousel";
import {Card, CardContent} from "@repo/design-system/components/ui/card";


const carouselItems = Array.from({ length: 10 })
    .map((_, i) => `item-${i}`)
    .map((v) => (
        <CarouselItem key={v} className="flex flex-col basis-1/6 pl-5">

            <div className="flex items-center justify-center overflow-hidden rounded-full">
                <img src="https://cdn.pixabay.com/photo/2018/01/03/17/05/palm-trees-3058728_1280.jpg" style={{aspectRatio: 1/1}} />
            </div>

            <span className="text-base mx-auto">{v}</span>
        </CarouselItem>
    ))

export default function TeamMembers() {
    return (
        <Carousel className="ml-6 mr-6 w-11/12">
            <CarouselContent>{carouselItems}</CarouselContent>
            <CarouselPrevious className="border-none -left-6 muted-foreground-500 bg-transparent hover:bg-transparent hover:text-fuchsia-700"/>
            <CarouselNext className="border-none -right-6 muted-foreground-500 bg-transparent hover:bg-transparent hover:text-fuchsia-700"/>
        </Carousel>
    )
}

//TODO CarouselItem Daten einlesen, Arrow austauschen