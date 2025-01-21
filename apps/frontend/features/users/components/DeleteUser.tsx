'use client'

import {UserSelect} from "@repo/database/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@repo/design-system/components/ui/alert-dialog";
import {Button, buttonVariants} from "@repo/design-system/components/ui/button";
import {useTranslations} from "next-intl";
import {deleteUser} from "@/features/users/users.actions";
import {redirect} from "@/features/i18n/routing";
import {getLocale} from "next-intl/server";

export default function DeleteUser({user}: { user: UserSelect }) {
  const translate = useTranslations()

  const handleDelete = async () => {
    await deleteUser(user.id)
    return redirect({href: '/', locale: await getLocale()})
  }

  return (
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
            onClick={handleDelete}
          >
            {translate('general.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}