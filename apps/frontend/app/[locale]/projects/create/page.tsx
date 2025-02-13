import { hasSessionPermission } from '@/features/auth/auth.utils'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'
import { CreateProjectForm } from '@/features/projects/components/CreateProjectForm'
import { serverEnv } from '@repo/env'
import { BanIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function CreateAProject() {
  const canCreateProject = await hasSessionPermission('project', 'create')
  const translate = await getTranslations('projects')
  if (!canCreateProject) {
    return (
      <div className="m-auto flex w-full max-w-screen-xl p-4">
        <div className="mx-auto flex flex-col items-center gap-4 rounded border border-border bg-muted p-4">
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
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto w-full max-w-screen-xl p-4">
      <CreateProjectForm maxFileSize={serverEnv.NEXT_PUBLIC_MAX_FILE_SIZE} />
    </div>
  )
}
