'use client'

import {UserCheck, UserPlus} from "lucide-react";
import {Button} from "@repo/design-system/components/ui/button";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {revalidateFollows, setFollows} from "@/features/userFollows/userFollows.actions";

export default function FollowButton(
  {isFollowing, userId, loggedInUserId} : {isFollowing: boolean, userId: string, loggedInUserId: string}
) {
  const translate = useTranslations()
  const [isFollowingReactive, setIsFollowingReactive] = useState(isFollowing)

  async function follow() {
    setIsFollowingReactive(true)
    await setFollows(loggedInUserId, userId)
    revalidateFollows()
  }
  async function unfollow() {
    setIsFollowingReactive(false)
    await setFollows(loggedInUserId, userId)
    revalidateFollows()
  }

  useEffect(() => {
    setIsFollowingReactive(isFollowing)
  }, [isFollowing])

  return (
    <Button
      variant={isFollowingReactive ? 'outline' : 'default'}
      onClick={isFollowingReactive ? unfollow : follow }
    >
      {isFollowingReactive ? <UserCheck />: <UserPlus />}
      {isFollowingReactive ? translate('users.unfollow') : translate('users.follow') }
    </Button>
  )
}