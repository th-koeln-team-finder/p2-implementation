import {getLocale, getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import {Button, buttonVariants} from "@repo/design-system/components/ui/button";
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
import {getUser} from "@/features/users/users.query";
import AccountForm from "@/features/users/components/AccountForm";
import {redirect} from "@/features/i18n/routing";

export default async function Account() {
  const translate = await getTranslations()
  const session = await authMiddleware()
  if (!session?.user?.id) {
    return redirect({href: '/', locale: await getLocale()})
  }

  const user = await getUser(session.user.id) as UserSelect

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">
        {translate('users.settings.account')}
      </h2>

      <AccountForm user={user} />

      <h3 className="font-bold text-xl my-8">
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