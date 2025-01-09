import type { UserSelect } from '@repo/database/schema'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar'
import { cn } from '@repo/design-system/lib/utils'

type UserAvatarProps = {
  user?: UserSelect
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({
  user,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const fallback = user ? user.name.slice(0, 2).toUpperCase() : 'AN'
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {user?.image ? (
        <AvatarImage
          src={user.image}
          alt={user.name ?? user.email ?? fallback}
        />
      ) : (
        <AvatarImage
          src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.name ?? 'anonymous'}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4,f88c49,f1f4dc,69d2e7&backgroundType=gradientLinear,solid&backgroundRotation=0,180,270,360&scale=80`}
          alt={user?.name ?? user?.email ?? fallback}
        />
      )}
      <AvatarFallback className={cn('text-sm', fallbackClassName)}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  )
}
