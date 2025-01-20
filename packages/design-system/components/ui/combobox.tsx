"use client"

import * as React from "react"
import {Check, ChevronsUpDown, LoaderCircle, PlusCircle} from "lucide-react"

import {Button} from "./button"
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
import {Badge} from "./badge"

type Option = {
  value: string
  label: string
  count?: number
}

type ComboboxProps = {
  options: Option[]
  placeholder?: string
  noResultsMessage?: string
  onSelect: (value: string | null) => void
  selectedValues?: string[] // Multiple selected values
  onOpen?: () => void
  onInput?: (input: string) => void
  onAddNew?: (newOption: string) => void
  addNewOptionText?: string | ((input: string) => string)
  isLoading?: boolean
  ariaLabel?: string
}

export function Combobox({
                           options,
                           placeholder = "Select an option...",
                           noResultsMessage = "No results found.",
                           onSelect,
                           selectedValues = [],
                           onOpen,
                           onInput,
                           onAddNew,
                           addNewOptionText = (input: string) => `Add "${input}" as a new option`,
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

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew(inputValue)
    }
    setInputValue("") // Clear the input after adding
    setOpen(false) // Close the combobox after adding
  }

  const isSelected = (option: Option) => selectedValues.includes(option.value)

  const formatter = new Intl.NumberFormat(undefined, {notation: "compact"})

  const showAddNewOption = inputValue && !options.some((option) => option.label === inputValue)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className="w-60 justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>
                <LoaderCircle className="animate-spin mx-auto"/>
              </CommandEmpty>
            ) : (
              <>
                {options.length === 0 && !showAddNewOption && (
                  <CommandEmpty>{noResultsMessage}</CommandEmpty>
                )}
                {options.length > 0 && (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={isSelected(option)}
                        onSelect={() => {
                          onSelect(option.value)
                        }}
                      >
                        {option.label}
                        <div className="flex gap-2 items-center ml-auto">
                          {option.count ? (
                            <Badge variant="secondary">
                              {formatter.format(option.count)}
                            </Badge>
                          ) : null}
                          {isSelected(option) ? (
                            <Check/>
                          ) : null}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {showAddNewOption && (
                  <CommandGroup>
                    <CommandItem onSelect={handleAddNew}>
                      <PlusCircle className="mr-2"/>
                      {typeof addNewOptionText === "function"
                        ? addNewOptionText(inputValue)
                        : addNewOptionText}
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
