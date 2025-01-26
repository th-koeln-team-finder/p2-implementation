import { authMiddleware } from '@/auth'
import { getUserSkills } from '@/features/users/users.query'
import type { UserSelect } from '@repo/database/schema'
import { Checkbox } from '@repo/design-system/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select'
import { getTranslations } from 'next-intl/server'

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()

  if (!session) {
    return <div>Not logged in</div>
  }

  const user = session.user as UserSelect

  const _skills = await getUserSkills(user.id)

  return (
    <section className="mt-8">
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.notifications')}
      </h2>

      <div className="mb-4 flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {translate('users.settings.activateNotifications')}
        </label>
      </div>

      <Select>
        <SelectTrigger>
          <SelectValue
            placeholder={translate('users.settings.selectNotificationType')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="email">E-Mail</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  )
}
