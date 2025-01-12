import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design-system/components/ui/alert-dialog'
import {
  Button,
  buttonVariants,
} from '@repo/design-system/components/ui/button'
import { getTranslations } from 'next-intl/server'

export default async function Account() {
  const translate = await getTranslations()

  return (
    <section>
      <h2 className="mb-8 font-bold text-2xl">
        {translate('users.settings.account')}
      </h2>

      <h3 className="mb-8 font-bold text-xl">
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
            <AlertDialogCancel>{translate('general.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
            >
              {translate('general.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
