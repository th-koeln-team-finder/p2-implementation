'use client'

import {
  deleteBrainstorm,
  revalidateBrainstorms,
} from '@/features/brainstorm/brainstorm.actions'
import { useRouter } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import { TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type DeleteBrainstormButtonProps = {
  brainstormId: string
}

export function DeleteBrainstormButton({
  brainstormId,
}: DeleteBrainstormButtonProps) {
  const router = useRouter()
  const translate = useTranslations('brainstorm')
  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      onClick={async () => {
        await deleteBrainstorm(brainstormId)
        await revalidateBrainstorms()
        router.push('/brainstorm')
      }}
    >
      <TrashIcon />
      {translate('deleteActionButton')}
    </Button>
  )
}
