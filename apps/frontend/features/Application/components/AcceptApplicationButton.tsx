'use client'

import {CheckIcon} from "lucide-react";
import {Button} from "@repo/design-system/components/ui/button";
import {useTranslations} from "next-intl";
import {acceptApplication} from "@/features/Application/applications.actions";
import {useRouter} from "@/features/i18n/routing";
import {CanUserClient} from "@/features/auth/components/CanUser.client";
import {ProjectSelect} from "@repo/database/schema";

export default function AcceptApplicationButton({project, applicationId}: {
  project: ProjectSelect,
  applicationId: string
}) {
  const translate = useTranslations('projects.application')
  const router = useRouter()

  const handleAccept = async () => {
    await acceptApplication(applicationId)
    router.push(`/projects/${project.id}/overview`)
  }

  return (
    <CanUserClient target="projectApplication" action="accept" data={{createdById: project.createdBy}}>
      <Button size="sm" onClick={handleAccept}>
        <CheckIcon/> {translate('acceptApplication')}
      </Button>
    </CanUserClient>
  )
}