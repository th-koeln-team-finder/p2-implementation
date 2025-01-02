import {ScrollArea} from "@repo/design-system/components/ui/scroll-area";
import {SkillsSelect, UserSkillsSelect} from "@repo/database/schema";
import {PlusIcon} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Button} from "@repo/design-system/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@repo/design-system/components/ui/popover";
import {Input} from "@repo/design-system/components/ui/input";

export default async function SkillsEdit({userSkills}: { userSkills: (UserSkillsSelect & { skill: SkillsSelect })[] }) {
  const t = await getTranslations('users.settings')

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
          <PopoverTrigger>
            <Button variant="outline" size="sm">
              <PlusIcon/>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Input />
          </PopoverContent>
        </Popover>
      </div>
    </ScrollArea>
  )
}