'use client'

import { useRouter } from '@/features/i18n/routing'
import {
  acceptInvitation,
  rejectInvitation,
} from '@/features/invitation/invitations.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

export default function ManageInvitationButton({
  projectId,
  invitationId,
  className,
}: {
  projectId: string
  invitationId: string
  className?: string
}) {
  const translate = useTranslations('invitations')
  const router = useRouter()

  const handleReject = async () => {
    await rejectInvitation(invitationId)
    router.push(`/projects/${projectId}/overview`)
  }

  const handleAccept = async () => {
    await acceptInvitation(invitationId)
    router.push(`/projects/${projectId}/overview`)
  }

  return (
    <div className={className}>
      <Button size="sm" variant="destructive" onClick={handleReject}>
        <CloseIcon /> {translate('rejectInvitation')}
      </Button>
      <Button size="sm" onClick={handleAccept}>
        <CheckIcon /> {translate('acceptInvitation')}
      </Button>
    </div>
  )
}
