"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, CheckIcon } from 'lucide-react'

import { cn } from "../../lib/utils"
import { CheckboxProps, CheckedState } from '@radix-ui/react-checkbox'
import { Signal } from '@preact/signals-react'
import { useFieldContext } from '@formsignals/form-react'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="h-3 w-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

type CheckboxSignalProps = Omit<CheckboxProps, "checked" | "onCheckedChange"> & {
  checked: Signal<CheckedState>
}
function CheckboxSignal({checked, ...props}: CheckboxSignalProps) {
  return (
    <Checkbox
      checked={checked.value}
      onCheckedChange={newChecked => (checked.value = newChecked)}
      {...props}
    />
  )
}
CheckboxSignal.displayName = "CheckboxSignal"

function CheckboxForm(props: Omit<CheckboxProps, "checked" | "onCheckedChange">) {
  const field = useFieldContext<CheckedState, "">()
  return (
    <CheckboxSignal checked={field.data} {...props} />
  )
}
CheckboxForm.displayName = "CheckboxForm"

export { Checkbox, CheckboxSignal, CheckboxForm }
