import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@repo/design-system/components/customCarousel'
import {useTranslations} from 'next-intl'
import Image from 'next/image'
import {UserAvatar} from "@/features/auth/components/UserAvatar";
import type {UserSelect} from "@repo/database/schema";

export type CarouselItem = { users: UserSelect }






export default function TeamMembers({
                                        participants

                                    }: {
    participants: CarouselItem[]

}) {
    const t = useTranslations('projects')
    let carouselItems
    if(participants != undefined){ {
    carouselItems = participants
        .map((participant) => `${participant.users.name}`)
        .map((user) => (
            <CarouselItem key={user} className="flex basis-1/3 flex-col md:basis-1/6">
                <div className="flex items-center justify-center overflow-hidden rounded-full">

                    <UserAvatar
                        user={participants[0].users}
                        className="h-6 w-6"
                        fallbackClassName="text-xs"
                    />

                </div>

                <span className="mx-auto text-base">{user}</span>
            </CarouselItem>
        ))
}
    }

    return (
        <div>
            <h2 className="mb-2 font-medium text-2xl">{t('team.title')}</h2>
            <div className="px-4">
                <Carousel>
                    <CarouselContent>{carouselItems?carouselItems:""}</CarouselContent>
                    <CarouselPrevious
                        className="-left-8 muted-foreground-500 border-none bg-transparent hover:bg-transparent hover:text-primary [&_svg]:size-8 [&_svg]:stroke-1"/>
                    <CarouselNext
                        className="-right-8 muted-foreground-500 border-none bg-transparent hover:bg-transparent hover:text-primary [&_svg]:size-8 [&_svg]:stroke-1"/>
                </Carousel>
            </div>
        </div>
    )
}

//TODO CarouselItem Daten einlesen
