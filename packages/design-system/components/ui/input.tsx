'use client'

import * as React from 'react'

import { useFieldContext } from '@formsignals/form-react'
import { useComputed } from '@preact/signals-react'
import { cn } from '../../lib/utils'

type InputProps = React.ComponentProps<'input'>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

type InputFormProps = Omit<InputProps, 'value' | 'onChange' | 'onBlur'> & {
  useTransformed?: boolean
}

const InputForm = ({ className, useTransformed, ...props }: InputFormProps) => {
  const field = useFieldContext()
  const errorClassName = useComputed(
    () => !field.isValid.value && 'border-destructive',
  )
  const classNames = cn(className, errorClassName.value)

  const data = useTransformed ? field.transformedData : field.data
  const onChange = useTransformed ? field.handleChangeBound : field.handleChange

  return (
    <Input
      className={classNames}
      value={data?.value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    />
  )
}
InputForm.displayName = 'InputForm'

export { Input, InputForm }
