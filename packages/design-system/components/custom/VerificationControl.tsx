'use client'

import {
  unverifyUserSkill,
  verifyUserSkill,
} from '../../../../apps/frontend/features/userSkillVerification/userSkillVerification.action'
import { revalidateUserSkills } from '../../../../apps/frontend/features/userSkills/userSkills.actions'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BadgeMinus, BadgePlus, LoaderCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type VerificationControlProps = {
  skillId: string
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

  const verifySkill = async (skillId: string) => {
    setLoading(true)
    await verifyUserSkill(verifierId, skillId)
    await revalidateUserSkills()
    setLoading(false)
  }

  const unverifySkill = async (skillId: string) => {
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
            {loading && <LoaderCircleIcon className="h-4 w-4 animate-spin" />}
            {!loading && isVerified ? <BadgeMinus /> : <BadgePlus />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isVerified ? t('unverifySkill') : t('verifySkill')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
