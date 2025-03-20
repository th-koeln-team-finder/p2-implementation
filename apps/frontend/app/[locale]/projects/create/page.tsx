import { hasSessionPermission } from '@/features/auth/auth.utils'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'
import { CreateProjectForm } from '@/features/projects/components/CreateProjectForm'
import { BanIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent } from '@repo/design-system/components/ui/card'

export default async function CreateAProject() {
  const canCreateProject = await hasSessionPermission('project', 'create')
  const translate = await getTranslations('projects')
  if (!canCreateProject) {
    return (
      <div className="container mx-auto grid h-screen place-content-center p-4">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center gap-4 py-4">
            <BanIcon className="text-destructive" size={128} />
            <div className="flex flex-col items-center gap-1">
              <p className="text-center font-semibold text-2xl">
                {translate('createProjectWarning')}
              </p>
              <p className="text-center text-lg text-muted-foreground leading-tight">
                {translate('createProjectWarningDescription')}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <LoginButton />
              <RegisterButton />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="mx-auto w-full max-w-screen-xl p-4">
      <CreateProjectForm />
    </div>
  )
}
