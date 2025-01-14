'use client'

import {ScrollArea} from "@repo/design-system/components/ui/scroll-area";
import {SkillsSelect, UserSkillsSelect} from "@repo/database/schema";
import {PlusIcon, Trash} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@repo/design-system/components/ui/button";
import {Label} from "@repo/design-system/components/ui/label";
import {searchSkills} from "@/features/skills/skills.queries";
import {MutableRefObject, useCallback, useRef, useState} from "react";
import {addSkill, revalidateSkills} from "@/features/skills/skills.actions";
import {Combobox} from "@repo/design-system/components/ui/combobox";
import {addUserSkill, removeUserSkill, updateUserSkillLevel} from "@/features/users/users.actions";
import {debounce} from "utils";

type ComboboxOption = {
  value: string
  label: string,
  count?: number
}

export default function SkillsEdit({userSkills, userId}: {
  userSkills: (UserSkillsSelect & { skill: SkillsSelect })[],
  userId: string
}) {
  const [skillInput, setSkillInput] = useState('')
  const [skillInputOpen, setSkillInputOpen] = useState(false)
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

  const handleInput = (input: string) => {
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
    <ScrollArea
      className="h-72 w-48 rounded-md border p-4 min-w-80"
    >
        <h4 className="mb-4 font-medium text-sm leading-none">Skills</h4>
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
            <Trash className="cursor-pointer place-self-end w-4 h-4 text-destructive" onClick={() => handleRemoveSkill(userSkill.id)}/>
          </div>
        ))}
        <div className="flex justify-center my-2">
          {!skillInputOpen ? (
            <Button ref={popoverTrigger} onClick={() => setSkillInputOpen(true)} variant="outline" size="sm">
              <PlusIcon/>
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
                >

                </Combobox>
              </div>
            </div>
          )}
        </div>
    </ScrollArea>
  )
}