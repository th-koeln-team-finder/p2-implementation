'use server'

import { authMiddleware } from '@/auth'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import { Link, redirect } from '@/features/i18n/routing'
import {
  SkillScale,
  type UserSkill,
} from '@/features/skills/components/SkillScale'
import { userFollowsUser } from '@/features/userFollows/userFollows.queries'
import { getUserSkills } from '@/features/userSkills/userSkills.query'
import FollowButton from '@/features/users/components/FollowButton'
import PreviouslyWorkedOn from '@/features/users/components/PreviouslyWorkedOn'
import { getUser } from '@/features/users/users.query'
import type { UserWithImage } from '@/features/users/users.types'
import type { UserSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import { UserPen } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function Profile({ user }: { user: UserWithImage }) {
  const translate = await getTranslations()

  const session = await authMiddleware()
  if (!user.isPublic) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  let isOwnProfile: boolean | undefined
  let isFollowing = false
  let loggedInUser: UserSelect | undefined

  if (session?.user.id) {
    isOwnProfile = user.id === session?.user.id
    loggedInUser = await getUser(session?.user.id)

    isFollowing = loggedInUser?.id
      ? !!(await userFollowsUser(loggedInUser.id, user.id))
      : false
  }
  const skills: UserSkill[] = (await getUserSkills(user.id)).map(
    (userSkill) => ({
      id: userSkill.id,
      name: userSkill.skill?.skill || '',
      level: userSkill.level,
      verifications: userSkill.verificationCount,
      isVerified: userSkill.isVerified,
    }),
  )

  return (
    <div>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="md:w-1/4">
          <UserAvatar user={user} className="h-32 w-32" />
        </div>

        <div>
          <div className="mb-2 flex flex-1 flex-col space-y-2">
            <p className="text-xs">
              {user.firstName || user.lastName ? (
                <span>
                  {user.firstName} {user.lastName}
                </span>
              ) : null}
              {(user.firstName || user.lastName) && user.occupation
                ? ' • '
                : null}
              {user.occupation && (
                <span className="font-bold">{user.occupation}</span>
              )}
            </p>
            <div className="flex items-center gap-8">
              <h1 className="inline font-bold text-3xl">{user.name}</h1>
              {isOwnProfile ? (
                <Link href="/edit-profile/profile">
                  <Button>
                    <UserPen />
                    {translate('users.editProfile')}
                  </Button>
                </Link>
              ) : (
                !!loggedInUser && (
                  <FollowButton
                    isFollowing={isFollowing}
                    userId={user.id}
                    loggedInUserId={loggedInUser.id}
                  />
                )
              )}
            </div>
            {user.lastActive && (
              <p className="text-muted-foreground text-xs leading-none">
                {translate('users.lastActivity')}:{' '}
                {new Date(user.lastActive).toLocaleDateString()}
              </p>
            )}
          </div>
          {/*{user.bio && <ProfileBio bio={user.bio}/>}*/}
        </div>
      </div>
      <div className="mt-8">
        <SkillScale
          title={translate('users.skills')}
          skills={skills}
          showVerificationControl={!isOwnProfile}
          loggedInUserId={loggedInUser?.id}
        />
      </div>
      <div className="mt-8">
        <h2 className="mb-2 font-bold text-2xl">
          {translate('users.previouslyWorkedOn')}
        </h2>
        <PreviouslyWorkedOn userId={user.id} />
      </div>
    </div>
  )
}
