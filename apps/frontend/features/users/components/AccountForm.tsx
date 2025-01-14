'use client'

import {Label} from "@repo/design-system/components/ui/label";
import {Input} from "@repo/design-system/components/ui/input";
import {Textarea} from "@repo/design-system/components/ui/textarea";
import {UserSelect} from "@repo/database/schema";
import {useTranslations} from "next-intl";
import {useCallback, useState} from "react";
import {debounce} from "@/utils";
import {updateUserData} from "@/features/users/users.actions";
import {revalidateSkills} from "@/features/skills/skills.actions";
import {Switch} from "@repo/design-system/components/ui/switch";
import {Avatar, AvatarFallback, AvatarImage} from "@repo/design-system/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/design-system/components/ui/select";

export default function AccountForm({user}: { user: UserSelect }) {
  const t = useTranslations()

  const [formData, setFormData] = useState({
    id: user.id,
    email: user.email,
    languagePreference: user.languagePreference,
  })

  const updateUserProperties = useCallback(
    debounce(async () => {
      await updateUserData(formData)
      await revalidateSkills()
    }, 200),
    []
  )

  const updateFormData = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [key]: event.target.value
    })

    updateUserProperties()
  }

  return (
    <div className="">
      <Label htmlFor="email" className="inline-block mb-2">{t('users.settings.email')}</Label>
      <Input name="email" type="email" className="mb-4" defaultValue={formData.email}/>

      <Label htmlFor="password" className="inline-block mb-2">{t('users.settings.password')}</Label>
      <Input disabled name="password" placeholder={t('general.notSupported')} className="mb-4"/>

      <Label htmlFor={'languagePreference'}>
        {t('users.settings.language')}
      </Label>
      <Select>
        <SelectTrigger className="mb-4" name="languagePreference">
          <SelectValue>
            {t('users.settings.language')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">
              English
            </SelectItem>
            <SelectItem value="de">
              Deutsch
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}