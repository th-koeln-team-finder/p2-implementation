import {getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import {Button, buttonVariants} from "@repo/design-system/components/ui/button";
import SkillsEdit from "@/features/users/components/SkillsEdit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@repo/design-system/components/ui/alert-dialog";
import {getUserSkills} from "@/features/users/users.query";
import {Checkbox} from "@repo/design-system/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/design-system/components/ui/select";

export default async function EditProfile() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  const user = session!.user! as UserSelect

  const skills = await getUserSkills(user.id)

  function deleteAccount() {
    alert('Account deleted')
  }

  return (
    <section className="mt-8">
      <h2 className="font-bold text-2xl mb-8">{
        translate('users.settings.notifications')}
      </h2>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox id="terms"/>
        <label
          htmlFor="terms"
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {translate('users.settings.activateNotifications')}
        </label>
      </div>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder={translate('users.settings.selectNotificationType')}/>
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