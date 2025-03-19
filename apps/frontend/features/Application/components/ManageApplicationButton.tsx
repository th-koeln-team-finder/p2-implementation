'use client'

import {
  acceptApplication,
  rejectApplication,
} from '@/features/Application/applications.actions'
import { CanUserClient } from '@/features/auth/components/CanUser.client'
import { useRouter } from '@/features/i18n/routing'
import type { ProjectSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

export default function ManageApplicationButton({
  project,
  applicationId,
}: {
  project: ProjectSelect
  applicationId: string
}) {
  const translate = useTranslations('projects.application')
  const router = useRouter()

  const handleReject = async () => {
    await rejectApplication(applicationId)
    router.push(`/projects/${project.id}/overview`)
  }

  const handleAccept = async () => {
    await acceptApplication(applicationId)
    router.push(`/projects/${project.id}/overview`)
  }

  return (
    <CanUserClient
      target="projectApplication"
      action="manage"
      data={{ createdById: project.createdBy }}
    >
      <Button size="sm" variant="destructive" onClick={handleReject}>
        <CloseIcon /> {translate('rejectApplication')}
      </Button>
      <Button size="sm" onClick={handleAccept}>
        <CheckIcon /> {translate('acceptApplication')}
      </Button>
    </CanUserClient>
  )
}
