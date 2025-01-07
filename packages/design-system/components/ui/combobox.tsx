"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@repo/design-system/lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

type Option = {
  value: string
  label: string
}

type ComboboxProps = {
  options: Option[]
  placeholder?: string
  noResultsMessage?: string
  onSelect: (value: string | null) => void
  selectedValue?: string | null
  onOpen?: () => void
  onInput?: (input: string) => void
  isLoading?: boolean
  ariaLabel?: string
}

export function Combobox({
                           options,
                           placeholder = "Select an option...",
                           noResultsMessage = "No results found.",
                           onSelect,
                           selectedValue,
                           onOpen,
                           onInput,
                           isLoading = false,
                           ariaLabel = "combobox",
                         }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && onOpen) {
      onOpen()
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (onInput) {
      onInput(value)
    }
  }

  const handleSelect = (value: string) => {
    onSelect(value === selectedValue ? null : value)
    setOpen(false)
  }

  const selectedOption = options.find((option) => option.value === selectedValue)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className="w-[200px] justify-between"
        >
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : options.length === 0 ? (
              <CommandEmpty>{noResultsMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValue === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
