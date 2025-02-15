'use client'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible'
import { ChevronDownIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

// @ts-ignore
export function SkillScale({
  projectSkills,
}: {
  title?: string
  projectSkills: { name: string; level: number }[]
}) {
  const translate = useTranslations()

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-2xl">
        {translate('projects.skillScale.skillTitle')}
      </h2>

      {!projectSkills.length && (
        <p className="text-muted-foreground text-sm italic">
          {translate('projects.skillScale.emptySkills')}
        </p>
      )}

      {!!projectSkills.length && (
        <div
          className="max-h-56 overflow-auto pr-1 pb-1"
          style={{ scrollbarGutter: 'stable' }}
        >
          <Collapsible className="group">
            <SkillPointList list={projectSkills.slice(0, 5)} />
            <CollapsibleContent>
              <SkillPointList list={projectSkills.slice(5)} />
            </CollapsibleContent>
            {projectSkills.length > 5 && (
              <div className="-bottom-1 sticky flex flex-row bg-background pt-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="mx-auto">
                    <p className="block group-data-[state=open]:hidden">
                      Show more
                    </p>
                    <p className="hidden group-data-[state=open]:block">
                      Show less
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

type SkillPointListProps = {
  list: { level: number; name: string }[]
}

function SkillPointList({ list }: SkillPointListProps) {
  return (
    <div className="flex flex-col gap-1">
      {list.map((projectSkill) => (
        <div key={projectSkill.name} className="flex flex-row justify-between">
          <p>{projectSkill.name}</p>
          <SkillPoints currentLevel={projectSkill.level} />
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
            level <= currentLevel
              ? 'bg-primary'
              : 'bg-primary/20 dark:bg-primary-foreground/60'
          }`}
        />
      ))}
    </div>
  )
}
