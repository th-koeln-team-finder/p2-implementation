"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from '@repo/design-system/lib/utils'
import {useSignals} from "@preact/signals-react/runtime";
import {useFieldContext} from "@formsignals/form-react";
import {useComputed} from "@preact/signals-react";


const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

type SwitchFormProps = Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'checked' | 'onChange'> & {
  useTransformed?: boolean
}
const SwitchForm = ({ className, useTransformed, ...props }: SwitchFormProps) => {
  useSignals()
  const field = useFieldContext()
  const errorClassName = useComputed(
    () => !field.isValid.value && 'border-destructive',
  )
  const classNames = cn(className, errorClassName.value)

  const data = useTransformed ? field.transformedData : field.data
  const onChange = useTransformed ? field.handleChangeBound : field.handleChange

  return (
    <Switch
      className={classNames}
      checked={data?.value}
      onCheckedChange={(e) => onChange(e)}
      {...props}
    />
  )
}
SwitchForm.displayName = 'SwitchForm'


export { Switch, SwitchForm }
