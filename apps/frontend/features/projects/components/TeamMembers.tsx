import { UserAvatar } from '@/features/auth/components/UserAvatar'
import type { UserWithImage } from '@/features/users/users.types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/design-system/components/customCarousel'
import { useTranslations } from 'next-intl'

export type CarouselItemProp = {
  projectRole?: string
  users: UserWithImage
}

export default function TeamMembers({
  participants,
}: {
  participants: CarouselItemProp[]
}) {
  const t = useTranslations('projects')

  return (
    <div>
      <h2 className="mb-2 font-medium text-xl">{t('team.title')}</h2>
      <Carousel className="mx-8">
        <CarouselContent className="px-4">
          {participants.map((participant) => (
            <CarouselItem
              key={participant.users.id}
              className="flex basis-1/3 flex-col sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
            >
              <UserAvatar
                user={participant.users}
                className="aspect-square h-auto w-full flex-1"
                fallbackClassName="text-xs"
              />
              <p className="mt-1 text-center">{participant.users.name}</p>

              <p className="text-center text-muted-foreground text-xs leading-3">
                {participant.projectRole}{' '}
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8 muted-foreground-500 border-none bg-transparent hover:bg-transparent hover:text-primary [&_svg]:size-8 [&_svg]:stroke-1" />
        <CarouselNext className="-right-8 muted-foreground-500 border-none bg-transparent hover:bg-transparent hover:text-primary [&_svg]:size-8 [&_svg]:stroke-1" />
      </Carousel>
    </div>
  )
}
