import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import { Button } from '@repo/design-system/components/ui/button'
import { ShellIcon, UserRoundPlus } from 'lucide-react'
import { UserAvatar } from '@/features/auth/components/UserAvatar'
import Link from 'next/link'
import type { getUsers } from '@/features/users/users.query'
import { getTranslations } from 'next-intl/server'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip'

type FindSomeoneListEntryProps = {
  user: Awaited<ReturnType<typeof getUsers>>[number]
  projectId: string
}

export async function FindSomeoneListEntry({
  user,
  projectId,
}: FindSomeoneListEntryProps) {
  const matchingTranslate = await getTranslations('projects.matching')
  return (
    <Link href={`/profile/${user.id}`}>
      <Card className="relative h-full">
        {user.totalMatchScore && +user.totalMatchScore > 0 && (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger className="absolute top-1 left-1 z-10 flex flex-row items-center gap-1 rounded bg-muted px-2 py-1 text-foreground text-xs">
                <ShellIcon className="size-3" />
                {(user.totalMatchScore * 100).toFixed(0)}
              </TooltipTrigger>
              <TooltipContent>
                <h6 className="font-semibold text-lg">
                  {matchingTranslate('tooltipTitle')}
                </h6>
                <p className="mb-2 max-w-xs text-muted-foreground">
                  {matchingTranslate('tooltipDescription')}
                </p>
                <table className="text-left" cellSpacing="0">
                  <tbody>
                    <tr className="bg-card">
                      <th className="p-1">
                        {matchingTranslate('skillMatchingScore')}
                      </th>
                      <td className="min-w-12 p-1 text-right">
                        {(user.skillMatchScore * 100).toFixed(0)}
                      </td>
                    </tr>
                    <tr className="bg-card/40">
                      <th className="p-1">
                        {matchingTranslate('interestMatchingScore')}
                      </th>
                      <td className="min-w-12 p-1 text-right">
                        {(user.projectTagMatchScore * 100).toFixed(0)}
                      </td>
                    </tr>
                    <tr className="border-border border-t bg-card">
                      <th className="p-1">
                        {matchingTranslate('totalMatchingScore')}
                      </th>
                      <td className="min-w-12 p-1 text-right">
                        {(user.totalMatchScore * 100).toFixed(0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <CardContent className="relative flex flex-col items-center justify-between gap-2 p-4">
          <Link href={`/projects/${projectId}/invite`}>
            <Button className="absolute top-2 right-2" variant="ghost">
              <UserRoundPlus className="size-5" />
            </Button>
          </Link>
          <div className="flex w-full flex-row justify-between gap-4 ">
            <UserAvatar user={user} className="h-20 w-20" />
            <div className="w-full space-y-2">
              <div className="flex flex-row items-center justify-between gap-2">
                <p className={'text-sm'}>{user.occupation ?? ' '}</p>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-l">{user.name}</CardTitle>
              </div>

              <CardDescription className="line-clamp-3 max-h-13 overflow-hidden">
                {user.bio && (
                  <WysiwygRenderer value={user.bio} renderAsString />
                )}
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/*
<div className={"flex flex-col w-full justify-between gap-2"}>
                        {user.skills.length && (
                        user.skills.map((skill,index) =>
                            index<2 && (
                                <div key={skill.skill.id} className={"flex items-center w-full flex-row justify-between gap-2"}>
                                    <p className={"text-sm "}>{skill.skill.skill}</p>
                                        <SkillPoints currentLevel={skill.level}/>
                                </div>
                            )
                        ))}
                    </div>
 */
