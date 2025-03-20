'use client'
import VerificationControl from '@/features/userSkills/components/VerificationControl'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip'
import { BadgeCheck, ChevronDownIcon, SquircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Rating } from '@repo/design-system/components/custom/rating'

type ProjectSkill = {
  label: string
  level: number
}

export type UserSkill = {
  label: string
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
    'loggedInUserId' in props ? props.loggedInUserId : undefined
  const translate = useTranslations()

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-xl">{title}</h2>

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
              list={skills.slice(0, 6)}
              showVerificationControl={showVerificationControl}
              loggedInUserId={loggedInUserId}
            />
            <CollapsibleContent>
              <SkillPointList
                list={skills.slice(6)}
                showVerificationControl={showVerificationControl}
                loggedInUserId={loggedInUserId}
              />
            </CollapsibleContent>
            {skills.length > 6 && (
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
            <div
              key={skill.label}
              className="flex flex-row items-center justify-between gap-4 px-1 py-0.5 odd:bg-muted"
            >
              <p className="text-sm">{skill.label}</p>
              <div className="flex items-center gap-2">
                <Rating
                  disabled
                  rating={skill.level}
                  totalStars={5}
                  Icon={<SquircleIcon />}
                  showText={false}
                  className="md:ml-auto"
                  rowClassName="gap-0.5"
                  starClassName="size-4"
                />

                {skill.verifications !== undefined &&
                  skill.verifications > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 text-primary text-sm">
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
            <div key={skill.label} className="flex flex-row justify-between">
              <p>{skill.label}</p>
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
