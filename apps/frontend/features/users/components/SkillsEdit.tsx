'use client'

import {SkillsSelect, UserSkillsSelect} from "@repo/database/schema";
import {Trash} from "lucide-react";
import {Label} from "@repo/design-system/components/ui/label";
import {searchSkills} from "@/features/skills/skills.queries";
import {MutableRefObject, useCallback, useRef, useState} from "react";
import {addSkill, revalidateSkills} from "@/features/skills/skills.actions";
import {Combobox} from "@repo/design-system/components/ui/combobox";
import {addUserSkill, removeUserSkill, updateUserSkillLevel} from "@/features/users/users.actions";
import {debounce} from "utils";
import {useTranslations} from "next-intl";

type ComboboxOption = {
  value: string
  label: string,
  count?: number
}

export default function SkillsEdit({userSkills, userId}: {
  userSkills: (UserSkillsSelect & { skill: SkillsSelect })[],
  userId: string
}) {
  const translate = useTranslations('users.settings.skills')

  const [skillInput, setSkillInput] = useState('')
  const [suggestions, setSuggestions] = useState<ComboboxOption[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const popoverTrigger: MutableRefObject<HTMLButtonElement | null> = useRef(null);

  const fetchSkills = useCallback(
    debounce((input: string) => {
      setSuggestionsLoading(true)
      searchSkills(input).then((skills) => {
        setSuggestions(
          skills.map(skill => ({
            value: skill.id.toString(),
            label: skill.skill,
            count: skill.usedCount
          }))
        )
        setSuggestionsLoading(false)
      })
    }, 200),
    []
  )

  const handleInput = (input: string = '') => {
    setSkillInput(input)
    fetchSkills(input)
  }

  const insertAndAddSkill = () => {
    addSkill({
      skill: skillInput
    }).then(response => {
      addSelectedSkill(response.toString())
    })
  }

  const addSelectedSkill = async (value: string | null) => {
    if (!value) {
      return
    }
    addUserSkill({
      userId,
      skillId: parseInt(value),
      level: 1
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
    <div>
      {userSkills.map((userSkill, index) => (
        <div key={index} className="max-w-sm grid grid-cols-3 items-center justify-around py-1">
          <div className="text-sm">{userSkill.skill.skill}</div>
          <div className="flex items-center gap-2.5">
            {[...Array(5)].map((_, i) => (
              <div key={i}
                   className={`h-2 w-2 rounded-full cursor-pointer ${i < userSkill.level ? 'bg-primary' : 'bg-gray-200'}`}
                   onClick={() => handleUpdateSkillLevel(userSkill.id, i + 1)}
              />
            ))}
          </div>
          <Trash className="cursor-pointer place-self-end w-4 h-4 text-destructive"
                 onClick={() => handleRemoveSkill(userSkill.id)}/>
        </div>
      ))}
      <div className="flex my-4">
        <div>
          <Label htmlFor="search">{translate('add')}</Label>
          <div className="flex w-full max-w-xl items-center space-x-2">
            <Combobox
              options={suggestions}
              placeholder={translate('search')}
              selectedValues={userSkills.map(skill => skill.skill.id.toString())}
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
    </div>
  )
}