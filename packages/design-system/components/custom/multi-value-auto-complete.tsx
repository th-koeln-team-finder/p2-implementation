// inspired by https://github.com/shadcn-ui/ui/issues/3647 and https://github.com/Balastrong/shadcn-autocomplete-demo/blob/main/src/components/autocomplete.tsx

import {
  unSignalifyValueSubscribed,
  useFieldContext,
} from '@formsignals/form-react'
import { useComputed } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { Command as CommandPrimitive } from 'cmdk'
import { Check, Loader2Icon, SearchXIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import type { InputProps } from '../../components/ui/input'
import { cn } from '../../lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover'

type AutoCompleteEntry<T extends string> = {
  value: T
  label: string
  labelRight?: string
}

type AutoCompleteTagInputProps<T extends string> = Omit<
  InputProps,
  'value' | 'onChange'
> & {
  enableCommaSeparation?: boolean
  values: AutoCompleteEntry<T>[]
  onValuesChange: (values: AutoCompleteEntry<T>[]) => void
  searchInput: string
  onSearchInputChange: (value: string) => void
  data: AutoCompleteEntry<T>[]
  isLoading?: boolean
  emptyMessage?: string
  loadingMessage?: string
  placeholder?: string
  clearAfterSelect?: boolean
  containerId?: string
  onOpenChange?: (open: boolean) => void
  enableTagUse?: boolean
}

export function MultiValueAutoComplete<T extends string>({
  values,
  onValuesChange,
  searchInput,
  onSearchInputChange,
  data,
  isLoading,
  emptyMessage,
  loadingMessage,
  enableCommaSeparation,
  className,
  clearAfterSelect,
  containerId,
  onOpenChange,
  enableTagUse,
  ...props
}: AutoCompleteTagInputProps<T>) {
  const [open, setOpen] = useState(false)

  const onSelectItem = (inputValue: AutoCompleteEntry<T>) => {
    if (values.some((value) => value.value === inputValue.value)) {
      onValuesChange(values.filter((value) => value.value !== inputValue.value))
    } else {
      onValuesChange([...values, inputValue])
    }
    if (clearAfterSelect) {
      onSearchInputChange('')
    }
  }

  return (
    <div className="flex items-center">
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          onOpenChange?.(open)
        }}
      >
        <Command shouldFilter={false} className="overflow-visible">
          <PopoverAnchor asChild>
            <div
              className={cn(
                'relative flex min-h-9 w-full flex-wrap gap-2 rounded-md border border-input py-1 pr-8 pl-3 text-sm disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring',
                className,
              )}
            >
              {isLoading && (
                <Loader2Icon className="absolute top-1 right-2 animate-spin" />
              )}
              {enableTagUse &&
                values.map((option) => (
                  <Badge key={option.value} variant="tag">
                    {option.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-3 w-3"
                      onClick={() => onSelectItem(option)}
                    >
                      <XIcon className="w-3" />
                    </Button>
                  </Badge>
                ))}
              <CommandPrimitive.Input
                asChild
                value={searchInput}
                onValueChange={(e) =>
                  onSearchInputChange(
                    enableTagUse
                      ? e.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      : e,
                  )
                }
                onMouseDown={() => {
                  const newOpen = !!searchInput || !open
                  setOpen(newOpen)
                  onOpenChange?.(newOpen)
                }}
                onFocus={() => {
                  setOpen(true)
                  onOpenChange?.(true)
                }}
              >
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpen(false)
                      onOpenChange?.(false)
                      return
                    }
                    if (e.key === ',' && enableCommaSeparation) {
                      e.preventDefault()
                      if (!data.length) {
                        return
                      }
                      onSelectItem(data[0])
                    }
                    if (e.key !== 'Backspace' || !!searchInput.length) {
                      return
                    }
                    e.preventDefault()
                    onValuesChange(values.slice(0, -1))
                  }}
                  {...props}
                />
              </CommandPrimitive.Input>
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            containerId={containerId}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                !(e.target instanceof Element) ||
                !e.target.hasAttribute('cmdk-input')
              ) {
                return
              }
              e.preventDefault()
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {data.length > 0 && (
                <CommandGroup>
                  {data.map((option) => (
                    <CommandItem
                      disabled={isLoading}
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={() => onSelectItem(option)}
                    >
                      <p className="text-xs md:text-sm">{option.label}</p>
                      <p className="ml-auto text-muted-foreground text-xs sm:text-sm">
                        {option.labelRight}
                      </p>
                      <Check
                        className={cn(
                          'mx-1 size-3 md:mx-2 md:size-4',
                          values.some((o) => o.value === option.value)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Loader2Icon className="animate-spin" />
                    <span className="text-muted-foreground text-sm">
                      {loadingMessage}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-row items-center justify-center gap-2">
                    <SearchXIcon />
                    <span className="text-muted-foreground text-sm">
                      {emptyMessage}
                    </span>
                  </div>
                )}
              </CommandEmpty>
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  )
}

export function MultiValueAutoCompleteForm<T extends string>({
  className,
  ...props
}: Omit<AutoCompleteTagInputProps<T>, 'values' | 'onValuesChange'>) {
  useSignals()
  const field = useFieldContext<string[], ''>()
  const values = unSignalifyValueSubscribed(field.data)

  const errorClassName = useComputed(
    () => !field.isValid.value && 'border-destructive',
  )
  const classNames = cn(className, errorClassName.value)

  return (
    <MultiValueAutoComplete
      values={values}
      onValuesChange={field.handleChange}
      className={classNames}
      {...props}
    />
  )
}
