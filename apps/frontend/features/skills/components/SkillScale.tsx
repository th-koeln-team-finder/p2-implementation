'use client'
import VerificationControl from '@/features/userSkills/components/VerificationControl'
import {Button} from '@repo/design-system/components/ui/button'
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from '@repo/design-system/components/ui/collapsible'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from '@repo/design-system/components/ui/tooltip'
import {BadgeCheck, ChevronDownIcon} from 'lucide-react'
import {useTranslations} from 'next-intl'

type ProjectSkill = {
  name: string
  level: number
}

export type UserSkill = {
  name: string
  level: number
  verifications: number
  id: string
  isVerified: boolean
}

type UserSkillScaleProps = {
  title?: string
  skills: UserSkill[]
  showVerificationControl?: boolean
  loggedInUserId: string | undefined
}

type ProjectSkillScaleProps = {
  title?: string
  skills: ProjectSkill[]
}

function isUserSkillProps(
  props: UserSkillScaleProps | ProjectSkillScaleProps,
): props is UserSkillScaleProps {
  return 'showVerificationControl' in props
}

// @ts-ignore
export function SkillScale(
  props: UserSkillScaleProps | ProjectSkillScaleProps,
) {
  const { title, skills } = props
  const showVerificationControl =
    'showVerificationControl' in props
      ? props.showVerificationControl
      : undefined
  const loggedInUserId =
    'loggedInUserId' in props
      ? props.loggedInUserId
      : undefined
  const translate = useTranslations()

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-2xl">{title}</h2>

      {!skills.length && (
        <p className="text-muted-foreground text-sm italic">
          {isUserSkillProps(props)
            ? translate('users.emptySkills')
            : translate('projects.skillScale.emptySkills')}
        </p>
      )}

      {!!skills.length && (
        <div
          className="overflow-auto pr-1 pb-1"
          style={{ scrollbarGutter: 'stable' }}
        >
          <Collapsible className="group">
            <SkillPointList
              list={skills.slice(0, 5)}
              showVerificationControl={showVerificationControl}
              loggedInUserId={loggedInUserId}
            />
            <CollapsibleContent>
              <SkillPointList
                list={skills.slice(5)}
                showVerificationControl={showVerificationControl}
                loggedInUserId={loggedInUserId}
              />
            </CollapsibleContent>
            {skills.length > 5 && (
              <div className="-bottom-1 sticky flex flex-row bg-background pt-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="mx-auto">
                    <p className="block group-data-[state=open]:hidden">
                      {translate('general.showMore')}
                    </p>
                    <p className="hidden group-data-[state=open]:block">
                      {translate('general.showLess')}
                    </p>
                    <ChevronDownIcon className="group-data-[state=open]:-rotate-180 rotate-0 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            )}
          </Collapsible>
        </div>
      )}
    </div>
  )
}

type ProjectSkillPointListProps = {
  list: ProjectSkill[]
}
type UserSkillPointListProps = {
  list: UserSkill[]
  showVerificationControl?: boolean
  loggedInUserId: string
}

function isUserSkillList(
  props: ProjectSkillPointListProps | UserSkillPointListProps,
): props is UserSkillPointListProps {
  return 'showVerificationControl' in props
}

function SkillPointList(
  props: ProjectSkillPointListProps | UserSkillPointListProps,
) {
  const translate = useTranslations()

  return (
    <div className="flex flex-col gap-1">
      {isUserSkillList(props)
        ? props.list.map((skill) => (
            <div key={skill.name} className="flex flex-row justify-between">
              <p>{skill.name}</p>
              <div className="flex items-center gap-4">
                <SkillPoints currentLevel={skill.level} />

                <div className="flex w-10 items-center justify-center gap-2">
                  {skill.verifications !== undefined &&
                    skill.verifications > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 text-fuchsia-700 text-sm">
                            <BadgeCheck size={16} />
                            <span>{skill.verifications}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {translate('users.verificationTooltip', {
                                verifications: skill.verifications,
                              })}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                </div>
                {props.showVerificationControl && props.loggedInUserId && (
                  <div className="flex justify-end">
                    <VerificationControl
                      skillId={skill.id}
                      isVerified={skill.isVerified}
                      verifierId={props.loggedInUserId}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        : props.list.map((skill) => (
            <div key={skill.name} className="flex flex-row justify-between">
              <p>{skill.name}</p>
              <SkillPoints currentLevel={skill.level} />
            </div>
          ))}
    </div>
  )
}

type SkillPointsProps = {
  currentLevel: number
}

const array5 = Array.from({ length: 5 }, (_, i) => i)

function SkillPoints({ currentLevel }: SkillPointsProps) {
  return (
    <div className="flex flex-row gap-2">
      {array5.map((level) => (
        <div
          key={level}
          className={`size-2 rounded-full ${
            level < currentLevel
              ? 'bg-primary'
              : 'bg-primary/20 dark:bg-primary-foreground/60'
          }`}
        />
      ))}
    </div>
  )
}
