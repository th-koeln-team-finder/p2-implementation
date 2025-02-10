'use client'

import { Button } from '@repo/design-system/components/ui/button'
import {unverifyUserSkill, verifyUserSkill} from "@/features/userSkillVerification/userSkillVerification.action";
import {revalidateUserSkills} from "@/features/userSkills/userSkills.actions";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {BadgeMinus, BadgePlus, LoaderCircleIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@repo/design-system/components/ui/tooltip";

type VerificationControlProps = {
  skillId: number
  isVerified: boolean
  verifierId: string
}

export default function VerificationControl({
  skillId,
  isVerified,
  verifierId,
}: VerificationControlProps) {
  const t = useTranslations('users')
  const [loading, setLoading] = useState(false)

  const verifySkill = async (skillId: number) => {
    setLoading(true)
    await verifyUserSkill(verifierId, skillId)
    await revalidateUserSkills()
    setLoading(false)
  }

  const unverifySkill = async (skillId: number) => {
    setLoading(true)
    await unverifyUserSkill(verifierId, skillId)
    await revalidateUserSkills()
    setLoading(false)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            onClick={async () => {
              if (isVerified) {
                await unverifySkill(skillId)
              } else {
                await verifySkill(skillId)
              }
            }}
            disabled={loading}
          >
            {loading ? (<LoaderCircleIcon className="h-4 w-4 animate-spin"/>) :
              isVerified ? <BadgeMinus /> : <BadgePlus />
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isVerified ? t('unverifySkill') : t('verifySkill')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
