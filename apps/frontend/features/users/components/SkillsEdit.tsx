'use client'

import {ScrollArea} from "@repo/design-system/components/ui/scroll-area";
import {SkillsSelect, UserSkillsSelect} from "@repo/database/schema";
import {PlusIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@repo/design-system/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@repo/design-system/components/ui/popover";
import {Label} from "@repo/design-system/components/ui/label";
import {searchSkills} from "@/features/skills/skills.queries";
import {MutableRefObject, useCallback, useRef, useState} from "react";
import {addSkill} from "@/features/skills/skills.actions";
import {Combobox} from "@repo/design-system/components/ui/combobox";
import {addUserSkill} from "@/features/users/users.actions";

function debounce<T extends (...args: any[]) => void>(func: T, timeout: number): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

type ComboboxOption = {
  value: string
  label: string
}

export default function SkillsEdit({userSkills, userId}: {
  userSkills: (UserSkillsSelect & { skill: SkillsSelect })[],
  userId: string
}) {
  const t = useTranslations()

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
            label: skill.skill
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
      addSelectedSkill(response.id.toString())
    })
  }

  const addSelectedSkill = (value: string | null) => {
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
  }

  if (!userSkills) {
    return null
  }

  return (
    <ScrollArea
      className="h-72 w-48 rounded-md border"
    >
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Skills</h4>
        {userSkills.map((userSkill, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className="text-sm">{userSkill.skill.skill}</div>
            <div className="flex items-center gap-2.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i < userSkill.level ? 'bg-primary' : 'bg-gray-200'}`}/>
              ))}
            </div>
          </div>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button ref={popoverTrigger} variant="outline" size="sm">
              <PlusIcon/>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Label htmlFor="search">Skill</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              {JSON.stringify(suggestions)}
              <Combobox
                options={suggestions}
                onInput={handleInput}
                isLoading={suggestionsLoading}
                onSelect={addSelectedSkill}
              >

              </Combobox>
              <Button size="sm" onClick={insertAndAddSkill}>
                {t('general.add')}
              </Button>
            </div>

          </PopoverContent>
        </Popover>
      </div>
    </ScrollArea>
  )
}