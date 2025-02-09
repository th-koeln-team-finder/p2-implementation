import {getLocale, getTranslations} from 'next-intl/server'
import {Avatar, AvatarFallback, AvatarImage,} from '@repo/design-system/components/ui/avatar'
import PreviouslyWorkedOn from '@/features/users/components/PreviouslyWorkedOn'
import {Button} from '@repo/design-system/components/ui/button'
import {UserPen} from 'lucide-react'
import Ratings from '@/features/users/components/Ratings'
import {getUser} from '@/features/users/users.query'
import {authMiddleware} from '@/auth'
import {Link, redirect} from '@/features/i18n/routing'
import type {UserSelect} from '@repo/database/schema'
import {userFollowsUser} from '@/features/userFollows/userFollows.queries'
import FollowButton from '@/features/users/components/FollowButton'
import {SkillScale} from "@/features/projects/components/SkillScale";
import {getUserSkills} from "@/features/userSkills/userSkills.query";

export default async function Profile(
  {
    user
  }:
  { user: UserSelect }
) {
  const translate = await getTranslations()

  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const isOwnProfile = user.id === session.user.id
  const loggedInUser = (await getUser(session.user.id)) as UserSelect

  const isFollowing = !!await userFollowsUser(loggedInUser.id, user.id)
  const skills = (await getUserSkills(user.id)).map(userSkill => ({
    name: userSkill.skill.skill,
    level: userSkill.level,
  }))

  const lastActivity = new Date()

  return (
    <main className="container mx-auto my-4">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="md:w-1/4">
          <Avatar className="w-40 h-40">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name ?? user.email ?? ''}
              />
            )}
            <AvatarFallback>
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'AN'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="flex flex-1 flex-col space-y-2">
            <p className="font-bold text-xs">Developer/Student</p>
            <div className="flex items-center gap-8">
              <h1 className="inline font-bold text-3xl">{user.name}</h1>
              {isOwnProfile ? (
                <Link href="/edit-profile">
                  <Button>
                    <UserPen />
                    {translate('users.editProfile')}
                  </Button>
                </Link>
              ) : (
                <FollowButton
                  isFollowing={isFollowing}
                  userId={user.id}
                  loggedInUserId={loggedInUser.id}
                />
              )}
              <Ratings />
            </div>
            <p className="text-muted-foreground text-xs leading-none">
              {translate('users.lastActivity')}:{' '}
              {lastActivity.toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm mt-4">{user.bio}</p>
        </div>
      </div>
      <div className="mt-8">
        <SkillScale title={translate('users.skills')} skills={skills} />
      </div>
      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">
          {translate('users.previouslyWorkedOn')}
        </h2>
        <PreviouslyWorkedOn
          userId={user.id}
        />
      </div>
    </main>
  )
}
