'use server'

import {Popover, PopoverContent, PopoverTrigger} from "@repo/design-system/components/ui/popover";
import {Button} from "@repo/design-system/components/ui/button";
import {Smile, UserPlus} from "lucide-react";
import {getTranslations} from "next-intl/server";

export default async function Ratings () {
  const translate = await getTranslations()
  const ratings = 4
  if (ratings < 1) return null
  let ratingIcon = <Smile className="h-8 w-8"/>
  let ratingHeadline = translate('users.friendly')
  let ratingText = translate('users.ratings')

  if (ratings >= 5) {
    ratingIcon = <Smile className="h-8 w-8"/>
    ratingHeadline = translate('users.very_friendly')
  }

  return <Popover>
    <PopoverTrigger>
      <Button variant="link">
        {ratingIcon}
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div className="font-bold text-xl">
        <span className="inline">{ratingIcon}</span>
        {ratingHeadline}
      </div>
      <p>
        {ratings} {ratingText}
      </p>
    </PopoverContent>
  </Popover>
}