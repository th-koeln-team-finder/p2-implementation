'use server'

import {Popover, PopoverContent, PopoverTrigger} from "@repo/design-system/components/ui/popover";
import {Meh, Smile} from "lucide-react";
import {getTranslations} from "next-intl/server";

export default async function Ratings() {
  const t = await getTranslations()
  const ratings = 5
  if (ratings < 1) return null
  let ratingIcon = <Meh className="h-8 w-8"/>
  let ratingHeadline = t('users.friendly')
  let ratingText = t('users.ratingText')

  if (ratings >= 5) {
    ratingIcon = <Smile className="h-8 w-8"/>
    ratingHeadline = t('users.veryFriendly')
  }

  return <Popover>
    <PopoverTrigger>
      <span className="text-primary">
        {ratingIcon}
      </span>
    </PopoverTrigger>
    <PopoverContent>
      <div className="font-bold text-xl flex gap-2 mb-2">
        {ratingIcon}
        {ratingHeadline}
      </div>
      <p>
        {ratings} {ratingText}
      </p>
    </PopoverContent>
  </Popover>
}