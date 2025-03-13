'use client'

import { debounce } from '@/features/general/utils'
import { addSkill } from '@/features/skills/skills.actions'
import { searchSkills } from '@/features/skills/skills.queries'
import { resetVerification } from '@/features/userSkillVerification/userSkillVerification.action'
import {
  addUserSkill,
  removeUserSkill,
  revalidateUserSkills,
  updateUserSkillLevel,
} from '@/features/userSkills/userSkills.actions'
import { useOptimisticUserSkills } from '@/features/userSkills/userSkills.hooks'
import type { SkillsSelect, UserSkillsSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Combobox,
  type Option,
} from '@repo/design-system/components/ui/combobox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog'
import { Label } from '@repo/design-system/components/ui/label'
import { BadgeCheck, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type MutableRefObject, useCallback, useRef, useState } from 'react'

export default function SkillsEdit({
  userSkills,
  userId,
}: {
  userSkills: (UserSkillsSelect & { skill: SkillsSelect })[]
  userId: string
}) {
  const translate = useTranslations('users.settings.skills')
  const translateGeneral = useTranslations('general')

  const [optimisticUserSkills, setOptimisticUserSkills] =
    useOptimisticUserSkills(userSkills)
  const [skillInput, setSkillInput] = useState('')
  const [suggestions, setSuggestions] = useState<Option[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const popoverTrigger: MutableRefObject<HTMLButtonElement | null> =
    useRef(null)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{
    skillId: string
    level: number
  } | null>(null)

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

  const handleInput = (input = '') => {
    setSkillInput(input)
    fetchSkills(input)
  }

  const insertAndAddSkill = () => {
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
    const selectedSkillLabel =
      suggestions.find((skill) => skill.value === value)?.label || skillInput
    setOptimisticUserSkills({
      action: 'add',
      values: {
        userId,
        skillId: value,
        level: 1,
        skill: {
          id: value,
          skill: selectedSkillLabel,
        },
      },
    })
    popoverTrigger.current?.click()
    await addUserSkill({
      userId,
      skillId: value,
      level: 1,
    })
    await revalidateUserSkills()
  }

  const handleRemoveSkill = async (skillId: string) => {
    setOptimisticUserSkills({ action: 'delete', values: { id: skillId } })
    await removeUserSkill(skillId)
    await revalidateUserSkills()
  }

  const handleUpdateSkillLevel = async (skillId: string, level: number) => {
    const skill = optimisticUserSkills.find((skill) => skill.id === skillId)
    if (!skill || skill.level === level) {
      return
    }
    if (skill.userSkillVerification && skill.userSkillVerification.length > 0) {
      setSelectedSkill({ skillId, level })
      setShowDialog(true)
      return
    }

    setOptimisticUserSkills({
      action: 'update',
      values: { id: skillId, level },
    })
    await updateUserSkillLevel(skillId, level)
    await revalidateUserSkills()
  }

  const confirmUpdateSkillLevel = async () => {
    if (selectedSkill) {
      setOptimisticUserSkills({
        action: 'update',
        values: { id: selectedSkill.skillId, level: selectedSkill.level },
      })
      setShowDialog(false)
      setSelectedSkill(null)
      await updateUserSkillLevel(selectedSkill.skillId, selectedSkill.level)
      await resetVerification(selectedSkill.skillId)
      await revalidateUserSkills()
    }
  }

  if (!optimisticUserSkills) {
    return null
  }

  return (
    <div>
      {optimisticUserSkills
        .sort((a, b) => b.level - a.level)
        .map((userSkill, index) => (
          <div
            key={userSkill.id}
            className={`grid max-w-sm grid-cols-3 items-center justify-around space-x-4 py-1 ${index % 2 === 0 ? 'bg-accent/30' : ''}`}
          >
            <div className="px-2 text-sm">{userSkill.skill?.skill}</div>
            <div className="flex items-center gap-2.5">
              {[...Array(5).keys()].map((level: number) => (
                <div
                  key={level}
                  className={`h-2 w-2 cursor-pointer rounded-full ${level < userSkill.level ? 'bg-primary' : 'bg-gray-200'}`}
                  onClick={() =>
                    handleUpdateSkillLevel(userSkill.id, level + 1)
                  }
                  onKeyDown={async (event) => {
                    if (event.key === 'Enter') {
                      await handleUpdateSkillLevel(userSkill.id, level + 1)
                    }
                  }}
                />
              ))}
            </div>
            <div className="flex h-full items-center place-self-end px-2">
              {(userSkill.userSkillVerification?.length || 0) > 0 && (
                <BadgeCheck className="mr-4 text-primary text-sm" size={16} />
              )}
              <Trash
                className="h-4 w-4 cursor-pointer text-destructive"
                onClick={() => handleRemoveSkill(userSkill.id)}
              />
            </div>
          </div>
        ))}
      <div className="my-4 flex">
        <div>
          <Label htmlFor="search">{translate('add')}</Label>
          <div className="flex w-full max-w-xl items-center space-x-2">
            <Combobox
              options={suggestions}
              placeholder={translate('search')}
              selectedValues={userSkills.map((skill) =>
                skill.skill.id.toString(),
              )}
              onInput={handleInput}
              onOpen={handleInput}
              isLoading={suggestionsLoading}
              onSelect={addSelectedSkill}
              noResultsMessage={translate('noResults')}
              onAddNew={insertAndAddSkill}
              addNewOptionText={translate('addEntered')}
            />
          </div>
        </div>
      </div>

      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>{translate('updateWarning')}</DialogDescription>
            <div className="flex justify-end gap-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  {translateGeneral('cancel')}
                </Button>
              </DialogClose>
              <Button onClick={confirmUpdateSkillLevel}>
                {translateGeneral('confirm')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
