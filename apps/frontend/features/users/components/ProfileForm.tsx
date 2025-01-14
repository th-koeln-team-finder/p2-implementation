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

export default function ProfileForm({user}: { user: UserSelect }) {
  const t = useTranslations()

  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    bio: user.bio,
    url: user.url,
    location: user.location,
    isPublic: user.isPublic,
    allowInvites: user.allowInvites,
    image: user.image,
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

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  });

  const setUserProfilePic = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const image = await toBase64(file)
    if (typeof image !== 'string') return

    setFormData({
      ...formData,
      image: image
    })
    updateUserProperties()
  }

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-8">
      <div className="w-full">
        <Label htmlFor="name" className="inline-block mb-2">{t('users.settings.username')}</Label>
        <Input name="name" className="mb-4" defaultValue={formData.name}/>

        <Label htmlFor="bio" className="inline-block mb-2">{t('users.settings.bio')}</Label>
        <Textarea name="bio" className="mb-4" onChange={(event) => updateFormData('bio', event)}>
          {user.bio}
        </Textarea>

        <Label htmlFor="url" className="inline-block mb-2">{t('users.settings.url')}</Label>
        <Input name="url" className="mb-4" defaultValue={formData.url ?? ''}/>

        <Label htmlFor="location" className="inline-block mb-2">{t('users.settings.location')}</Label>
        <Input name="location" className="mb-4" defaultValue={formData.location ?? ''}/>

        <Label htmlFor="isPublic" className="inline-block mb-2">{t('users.settings.isPublic')}</Label>
        <Switch name="isPublic" className="mb-4 block" defaultChecked={formData.isPublic}/>

        <Label htmlFor="allowInvites" className="inline-block mb-2">{t('users.settings.allowInvites')}</Label>
        <Switch name="allowInvites" className="mb-4 block" defaultChecked={formData.allowInvites}/>
      </div>
      <div className="mb-4 w-1/3">
        <Label htmlFor="image" className="inline-block mb-2">{t('users.settings.profilePicture')}</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-40 h-40">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name ?? user.email ?? ''}
              />
            )}
            <AvatarFallback>
              {user.name
                ? user.name.slice(0, 2).toUpperCase()
                : 'AN'}
            </AvatarFallback>
          </Avatar>
          <Input type="file" name="image" className="mb-4 w-40" onChange={setUserProfilePic}/>
        </div>
      </div>
    </div>
  )
}