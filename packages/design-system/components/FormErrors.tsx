import { useFieldContext, useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { Loader2Icon, XCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function FieldError() {
  useSignals()
  const field = useFieldContext()
  const translate = useTranslations()

  if (field.isValidating.value) {
    return (
      <div className="flex flex-row items-center gap-1 text-muted-foreground">
        <Loader2Icon className="h-4 min-h-4 w-4 min-w-4 animate-spin" />
        <p className="text-sm">{translate('validation.inProgress')}</p>
      </div>
    )
  }
  if (field.isValid.value) return null
  return (
    <div className="flex flex-col gap-1">
      {field.errors.value.map((error: string) => (
        <div
          key={error}
          className="flex flex-row items-center gap-1 text-destructive"
        >
          <XCircleIcon className="h-4 min-h-4 w-4 min-w-4" />
          <p className="text-sm">{error}</p>
        </div>
      ))}
    </div>
  )
}

export function FormError() {
  useSignals()
  const form = useFormContext()
  const translate = useTranslations()

  if (form.isValidating.value) {
    return (
      <div className="flex flex-row items-center gap-1 text-muted-foreground">
        <Loader2Icon className="h-4 min-h-4 w-4 min-w-4 animate-spin" />
        <p className="text-sm">{translate('validation.inProgress')}</p>
      </div>
    )
  }
  if (form.isValid.value) return null
  return (
    <div className="flex flex-col gap-1">
      {form.errors.value.map((error: string) => (
        <div
          key={error}
          className="flex flex-row items-center gap-1 text-destructive"
        >
          <XCircleIcon className="h-4 min-h-4 w-4 min-w-4" />
          <p className="text-sm">{error}</p>
        </div>
      ))}
    </div>
  )
}
