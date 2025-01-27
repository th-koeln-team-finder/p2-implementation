import { useSessionPermission } from '@/features/auth/auth.hooks'
import { LoginButton } from '@/features/auth/components/LoginButton'
import { RegisterButton } from '@/features/auth/components/RegisterButton'
import {
  addBrainstormComment,
  revalidateBrainstormComments,
} from '@/features/brainstorm/brainstormComment.actions'
import type { OptimisticPayload } from '@/features/brainstorm/brainstormComment.hooks'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import {
  FieldError,
  FormError,
} from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { cn } from '@repo/design-system/lib/utils'
import { MessageCircleIcon, SendHorizonalIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

type BrainstormCommentFormProps = {
  className?: string
  brainstormId: string
  parentCommentId?: string
  autoFocus?: boolean
  setOptimistic: (payload: OptimisticPayload) => void
}

export function BrainstormCommentForm({
  className,
  brainstormId,
  parentCommentId,
  autoFocus,
  setOptimistic,
}: BrainstormCommentFormProps) {
  const translateError = useTranslations('validation')
  const translate = useTranslations('brainstorm.comments')
  const canCreate = useSessionPermission('commentBrainstorm', 'create')

  useSignals()
  const form = useForm({
    validatorAdapter: ZodAdapter,
    disabled: !canCreate,
    defaultValues: {
      brainstormId,
      parentCommentId,
      comment: '',
    },
    onSubmit: async (values) => {
      setOptimistic({ action: 'add', values })
      form.reset()
      await addBrainstormComment(values).catch((err) => {
        console.error('Error adding brainstorm comment', err)
      })
      await revalidateBrainstormComments().catch((err) => {
        console.error('Error revalidating comments', err)
      })
    },
  })

  return (
    <form
      className={cn('w-full', className)}
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
      }}
    >
      {canCreate && (
        <form.FormProvider>
          <form.FieldProvider
            name="comment"
            validator={z
              .string({ required_error: translateError('required') })
              .min(1, translateError('minLengthX', { amount: 1 }))}
          >
            <div className="mx-1 mt-2 flex flex-row items-center gap-2">
              <div className="relative flex-1">
                <MessageCircleIcon className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-muted-foreground" />
                <InputForm
                  autoFocus={autoFocus}
                  placeholder={translate('inputPlaceholder')}
                  className="pr-8 pl-8"
                  disabled={!canCreate || form.isSubmitting.value}
                />
              </div>
              <Button
                type="submit"
                disabled={!canCreate || !form.canSubmit.value}
              >
                {translate('inputSubmitButton')}
                <SendHorizonalIcon className="h-4 w-4" />
              </Button>
            </div>
            <FieldError />
          </form.FieldProvider>
          <FormError />
        </form.FormProvider>
      )}
      {!canCreate && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-muted-foreground text-sm">
            {translate('loginCommentWarning')}
          </p>
          <div className="flex flex-row items-center gap-2">
            <LoginButton />
            <RegisterButton />
          </div>
        </div>
      )}
    </form>
  )
}
