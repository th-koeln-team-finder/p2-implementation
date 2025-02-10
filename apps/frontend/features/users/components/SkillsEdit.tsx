'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@repo/design-system/components/ui/dialog';
import {Button} from '@repo/design-system/components/ui/button';
import {MutableRefObject, useCallback, useRef, useState} from 'react';
import {Combobox} from "@repo/design-system/components/ui/combobox";
import {Label} from "@repo/design-system/components/ui/label";
import {BadgeCheck, Trash} from "lucide-react";
import {
  addUserSkill,
  removeUserSkill,
  revalidateUserSkills,
  updateUserSkillLevel
} from "@/features/userSkills/userSkills.actions";
import {addSkill} from "@/features/skills/skills.actions";
import {searchSkills} from "@/features/skills/skills.queries";
import {debounce} from "@/utils";
import {useOptimisticUserSkills} from "@/features/userSkills/userSkills.hooks";
import {useTranslations} from "next-intl";
import type {SkillsSelect, UserSkillsSelect} from "@repo/database/schema";
import {resetVerification} from "@/features/userSkillVerification/userSkillVerification.action";

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
  const [suggestions, setSuggestions] = useState<ComboboxOption[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const popoverTrigger: MutableRefObject<HTMLButtonElement | null> =
    useRef(null)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{
    skillId: number
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
        skillId: Number.parseInt(value),
        level: 1,
        skill: {
          id: Number.parseInt(value),
          skill: selectedSkillLabel,
        },
      },
    })
    popoverTrigger.current?.click()
    await addUserSkill({
      userId,
      skillId: Number.parseInt(value),
      level: 1,
    })
    await revalidateUserSkills()
  }

  const handleRemoveSkill = async (skillId: number) => {
    setOptimisticUserSkills({ action: 'delete', values: { id: skillId } })
    await removeUserSkill(skillId)
    await revalidateUserSkills()
  }

  const handleUpdateSkillLevel = async (skillId: number, level: number) => {
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
            key={index}
            className={`max-w-sm grid grid-cols-3 items-center justify-around py-1 ${index % 2 === 0 ? 'bg-accent/30' : ''}`}
          >
            <div className="text-sm px-2">{userSkill.skill?.skill}</div>
            <div className="flex items-center gap-2.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  tabIndex={0}
                  className={`h-2 w-2 rounded-full cursor-pointer ${i < userSkill.level ? 'bg-primary' : 'bg-gray-200'}`}
                  onClick={() => handleUpdateSkillLevel(userSkill.id, i + 1)}
                />
              ))}
            </div>
            <div className="flex items-center px-2 place-self-end h-full">
              {(userSkill.userSkillVerification?.length || 0) > 0 && (
                <BadgeCheck className="text-sm text-primary mr-4" size={16} />
              )}
              <Trash
                className="cursor-pointer w-4 h-4 text-destructive"
                onClick={() => handleRemoveSkill(userSkill.id)}
              />
            </div>
          </div>
        ))}
      <div className="flex my-4">
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
