'use client'

import {CheckIcon} from "lucide-react";
import {Button} from "@repo/design-system/components/ui/button";
import {useTranslations} from "next-intl";
import {acceptApplication} from "@/features/Application/applications.actions";
import {useRouter} from "@/features/i18n/routing";

export default function AcceptApplicationButton({projectId, applicationId}: { projectId: string, applicationId: string }) {
  const translate = useTranslations('projects.application')
  const router = useRouter()

  const handleAccept = async () => {
    await acceptApplication(applicationId)
    router.push(`/projects/${projectId}/overview`)
  }

  return (<Button size="sm" onClick={handleAccept}>
    <CheckIcon/> {translate('acceptApplication')}
  </Button>)
}