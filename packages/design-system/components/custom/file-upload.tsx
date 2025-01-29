'use client'

import { useFieldContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import type { HTMLProps, ReactNode } from 'react'
import { FieldPlaceholder } from '../../components/custom/field-placeholder'
import { cn } from '../../lib/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type FileUploadProps = {
  className?: string
  containerClassName?: string
  multiple?: boolean
  accepts?: string
  placeholder?: ReactNode
  style?: HTMLProps<HTMLDivElement>['style']
}

export function FileUploadForm({
  className,
  containerClassName,
  multiple,
  placeholder = <FieldPlaceholder />,
  accepts,
  style,
}: FileUploadProps) {
  useSignals()
  const field = useFieldContext<File[]>()

  return (
    <div className={containerClassName}>
      <Label
        className={cn(
          'relative flex min-h-52 cursor-pointer items-center justify-center rounded border border-border border-dashed ring-ring focus-within:border-foreground focus-within:ring hover:border-foreground',
          className,
        )}
        style={style}
      >
        {placeholder}
        <Input
          type="file"
          accept={accepts}
          multiple={multiple}
          className="absolute inset-0 h-full w-full opacity-0"
          onChange={(e) => {
            if (!e.target.files) {
              field.handleChange(null)
              return
            }
            field.handleChange(Array.from(e.target.files))
          }}
        />
      </Label>
    </div>
  )
}
