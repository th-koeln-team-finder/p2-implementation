'use client'

import { addSkill, revalidateSkills } from '@/features/skills/skills.actions'
import { searchSkills } from '@/features/skills/skills.queries'
import {
  addUserSkill,
  removeUserSkill,
  updateUserSkillLevel,
} from '@/features/users/users.actions'
import type { SkillsSelect, UserSkillsSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import { Combobox } from '@repo/design-system/components/ui/combobox'
import { Label } from '@repo/design-system/components/ui/label'
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area'
import { PlusIcon, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type MutableRefObject, useCallback, useRef, useState } from 'react'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

type ComboboxOption = {
  value: string
  label: string
  count?: number
}

export default function SkillsEdit({
  userSkills,
  userId,
}: {
  userSkills: (UserSkillsSelect & { skill: SkillsSelect })[]
  userId: string
}) {
  const _t = useTranslations()

  const [skillInput, setSkillInput] = useState('')
  const [skillInputOpen, setSkillInputOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<ComboboxOption[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const popoverTrigger: MutableRefObject<HTMLButtonElement | null> =
    useRef(null)

  const fetchSkills = useCallback(
    debounce((input: string) => {
      setSuggestionsLoading(true)
      searchSkills(input).then((skills) => {
        setSuggestions(
          skills.map((skill) => ({
            value: skill.id.toString(),
            label: skill.skill,
            count: skill.usedCount,
          })),
        )
        setSuggestionsLoading(false)
      })
    }, 200),
    [],
  )

  const handleInput = (input: string) => {
    setSkillInput(input)
    fetchSkills(input)
  }

  const _insertAndAddSkill = () => {
    addSkill({
      skill: skillInput,
    }).then((response) => {
      addSelectedSkill(response.toString())
    })
  }

  const addSelectedSkill = async (value: string | null) => {
    if (!value) {
      return
    }
    addUserSkill({
      userId,
      skillId: Number.parseInt(value),
      level: 1,
    }).then(() => {
      popoverTrigger.current?.click()
    })
    await revalidateSkills()
  }

  const handleRemoveSkill = async (skillId: number) => {
    await removeUserSkill(skillId)
    await revalidateSkills()
  }

  const handleUpdateSkillLevel = async (skillId: number, level: number) => {
    await updateUserSkillLevel(skillId, level)
    await revalidateSkills()
  }

  if (!userSkills) {
    return null
  }

  return (
    <ScrollArea className="h-72 w-48 min-w-80 rounded-md border p-4">
      <h4 className="mb-4 font-medium text-sm leading-none">Skills</h4>
      {userSkills.map((userSkill, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="grid max-w-sm grid-cols-3 items-center justify-around py-1"
        >
          <div className="text-sm">{userSkill.skill.skill}</div>
          <div className="flex items-center gap-2.5">
            {[...Array(5)].map((_, i) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className={`h-2 w-2 cursor-pointer rounded-full ${i < userSkill.level ? 'bg-primary' : 'bg-gray-200'}`}
                onClick={() => handleUpdateSkillLevel(userSkill.id, i + 1)}
              />
            ))}
          </div>
          <Trash
            className="h-4 w-4 cursor-pointer place-self-end text-destructive"
            onClick={() => handleRemoveSkill(userSkill.id)}
          />
        </div>
      ))}
      <div className="my-2 flex justify-center">
        {!skillInputOpen ? (
          <Button
            ref={popoverTrigger}
            onClick={() => setSkillInputOpen(true)}
            variant="outline"
            size="sm"
          >
            <PlusIcon />
          </Button>
        ) : (
          <div>
            <Label htmlFor="search">Skill</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Combobox
                options={suggestions}
                onInput={handleInput}
                isLoading={suggestionsLoading}
                onSelect={addSelectedSkill}
              />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
