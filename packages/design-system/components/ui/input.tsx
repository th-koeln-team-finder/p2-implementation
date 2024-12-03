"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Signal, useComputed } from '@preact/signals-react'
import { useFieldContext } from '@formsignals/form-react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

type InputSignalsProps = Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value?: Signal<string>
}
const InputSignals = ({value, ...props}: InputSignalsProps) => {
  return (
    <Input
      {...props}
      value={value?.value}
      onChange={value && ((event) => {
        value.value = event.target.value
      })}
    />
  )
}
InputSignals.displayName = "InputSignals"

const InputForm = ({ className, ...props }: Omit<InputSignalsProps, "value">) => {
  const field = useFieldContext()
  const errorClassName = useComputed(() => !field.isValid.value && "border-destructive")
  const classNames = cn(className, errorClassName.value)
  return (
    <InputSignals className={classNames} value={field.data} {...props} />
  )
}
InputForm.displayName = "InputForm"

export { Input, InputSignals, InputForm }
