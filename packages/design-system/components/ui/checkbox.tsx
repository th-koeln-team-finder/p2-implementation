'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '../../lib/utils'
import { useFieldContext } from '@formsignals/form-react'
import { useComputed } from '@preact/signals-react'
import type { CheckboxProps, CheckedState } from '@radix-ui/react-checkbox'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckIcon className="h-3 w-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

type CheckboxFormProps = Omit<CheckboxProps, 'checked' | 'onCheckedChange'>
function CheckboxForm({
  className,
  ...props
}: Omit<CheckboxProps, 'checked' | 'onCheckedChange'>) {
  const field = useFieldContext<CheckedState, ''>()
  const errorClassName = useComputed(
    () => !field.isValid.value && 'border-destructive',
  )
  const classNames = cn(className, errorClassName.value)

  return (
    <Checkbox
      className={classNames}
      checked={field.data?.value}
      onCheckedChange={(v) => field.handleChange(v)}
      onBlur={field.handleBlur}
      {...props}
    />
  )
}
CheckboxForm.displayName = 'CheckboxForm'

export { Checkbox, CheckboxForm }
