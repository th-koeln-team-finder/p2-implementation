import * as React from "react"
import {cn} from '@repo/design-system/lib/utils'
import {useSignals} from "@preact/signals-react/runtime";
import {useFieldContext} from "@formsignals/form-react";
import {useComputed} from "@preact/signals-react";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({className, ...props}, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

type TextareaFormProps = Omit<React.ComponentProps<"textarea">, 'value' | 'onChange' | 'onBlur'> & {
  useTransformed?: boolean
}
const TextareaForm = ({className, useTransformed, ...props}: TextareaFormProps) => {
  useSignals()
  const field = useFieldContext()
  const errorClassName = useComputed(
    () => !field.isValid.value && 'border-destructive',
  )
  const classNames = cn(className, errorClassName.value)

  const data = useTransformed ? field.transformedData : field.data
  const onChange = useTransformed ? field.handleChangeBound : field.handleChange

  return (
    <Textarea
      className={classNames}
      value={data?.value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    />
  )
}
TextareaForm.displayName = 'TextareaForm'

export {Textarea, TextareaForm}
