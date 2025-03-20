'use client'

import {retractApplication,} from '@/features/Application/applications.actions'
import {Button} from '@repo/design-system/components/ui/button'
import {CheckIcon, MessageSquareOffIcon} from 'lucide-react'
import {useTranslations} from 'next-intl'

export default function RetractApplicationButton({
                                                   applicationId,
                                                 }: {
  applicationId: string
}) {
  const translate = useTranslations('communicationDashboard')

  const handleRetract = async () => {
    await retractApplication(applicationId)
  }

  return (
    <Button size="sm" onClick={handleRetract}>
      <MessageSquareOffIcon /> {translate('retractApplication')}
    </Button>
  )
}
