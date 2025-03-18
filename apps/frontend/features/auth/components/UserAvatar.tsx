'use client'

import { getPublicFileUrl } from '@/features/file-upload/file-upload.actions'
import type { UserWithImage } from '@/features/users/users.types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar'
import { cn } from '@repo/design-system/lib/utils'
import { useEffect, useState } from 'react'

type UserAvatarProps = {
  user?: UserWithImage
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({
  user,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const fallback = user ? user.name.slice(0, 2).toUpperCase() : 'AN'
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>()
  const [_useFallback, _setUseFallback] = useState(false)

  useEffect(() => {
    if (user?.image?.bucketPath) {
      getPublicFileUrl(user.image.bucketPath).then((response) => {
        setUserAvatarUrl(response[0])
      })
    }
  }, [user?.image?.bucketPath])

  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {userAvatarUrl && (
        <AvatarImage
          src={userAvatarUrl}
          alt={user?.name ?? user?.email ?? fallback}
        />
      )}
      {!userAvatarUrl && (
        <AvatarFallback className={cn('text-sm', fallbackClassName)}>
          {fallback}
        </AvatarFallback>
      )}
      {!user?.image?.bucketPath && (
        <AvatarImage
          src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.name ?? 'anonymous'}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4,f88c49,f1f4dc,69d2e7&backgroundType=gradientLinear,solid&backgroundRotation=0,180,270,360&scale=80`}
          alt={user?.name ?? user?.email ?? fallback}
        />
      )}
    </Avatar>
  )
}
