'use client'
import { Button } from '../../components/ui/button'
import { CalendarForm } from '../../components/ui/calendar'
import { InputForm } from '../../components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover'
import { cn } from '../../lib/utils'
import { useFieldContext } from '@formsignals/form-react'
import { useComputed } from '@preact/signals-react'
import { CalendarIcon } from 'lucide-react'
import {useSignals} from "@preact/signals-react/runtime";

type DatePickerProps = {
  placeholder?: string
}

export function DatePickerForm({ placeholder }: DatePickerProps) {
  useSignals()
  const field = useFieldContext<Date, '', string>()

  const classNames = useComputed(() => {
    const hasSelection = field.data.value
    const isValid = field.isValid.value
    return cn(
      !hasSelection && 'text-muted-foreground',
      !isValid && 'border-destructive',
    )
  })

  return (
    <Popover>
      <div className="relative min-w-[280px] flex-1">
        <InputForm useTransformed placeholder="dd.MM.yyyy" />
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute top-[50%] right-0 translate-y-[-50%] rounded-l-none font-normal',
              classNames.value,
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <CalendarForm mode="single" initialFocus />
      </PopoverContent>
    </Popover>
  )
}
