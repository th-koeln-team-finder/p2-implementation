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

export default async function Account() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  const user = session!.user! as UserSelect

  const skills = await getUserSkills(user.id)

  function deleteAccount() {
    alert('Account deleted')
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.account')}
      </h2>

      <h3 className="font-bold text-xl mb-8">
        {translate('users.settings.dangerZone')}
      </h3>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            {translate('users.settings.deleteAccount')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {translate('users.settings.deleteAreYouSure')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {translate('general.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({variant: 'destructive'})}
            >
              {translate('general.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}