"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
  allowCustom?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyText = "No option found.",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  allowCustom = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : (value || "")

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue
    onValueChange?.(newValue)
    setOpen(false)
    setSearchValue("")
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (allowCustom && e.key === "Enter" && searchValue && filteredOptions.length === 0) {
      onValueChange?.(searchValue)
      setOpen(false)
      setSearchValue("")
    }
  }

  const handleInputValueChange = (newValue: string) => {
    setSearchValue(newValue)
    if (allowCustom && newValue && filteredOptions.length === 0) {
      // Show the custom value as an option
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between px-3 py-2 h-9", className)}
          disabled={disabled}
        >
          <span className="truncate text-left">
            {displayValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={handleInputValueChange}
            onKeyDown={handleInputKeyDown}
          />
          <CommandEmpty>
            {allowCustom && searchValue ? (
              <div className="px-2 py-1">
                <div
                  className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    onValueChange?.(searchValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  Add &quot;{searchValue}&quot;
                </div>
              </div>
            ) : (
              <div className="px-2 py-1.5 text-sm">
                {emptyText}
              </div>
            )}
          </CommandEmpty>
          {filteredOptions.length > 0 && (
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="flex items-center px-2 py-1.5"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check className="h-4 w-4 ml-2 shrink-0" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}