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
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useDialogueManager from "@/hooks/useDialogManager"
import { useId } from "react"
import { useHotkeys } from "react-hotkeys-hook"

export interface ComboBoxItemInterface {
  value: string
  label: string
}

export type ComboBoxItem = ComboBoxItemInterface | null
export interface ComboBoxProps {
  itemList?: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  selectedItemValue?: string | null
  searchFieldPlaceholder?: string
  noFieldsFoundText?: string
  inputFieldsText?: string
  className?: string
  triggerClassName?: string
  onChange: (value?: string) => void
}

const defaultProps: ComboBoxProps = {
  selectedItemValue: null,
  itemList: [],
  onChange: () => {},
  searchFieldPlaceholder: "Search...",
  noFieldsFoundText: "No fields found",
  inputFieldsText: "Select item...",
  className: "",
  triggerClassName: "",
}

export function ComboBox({
  selectedItemValue,
  itemList,
  searchFieldPlaceholder = defaultProps.searchFieldPlaceholder,
  noFieldsFoundText = defaultProps.noFieldsFoundText,
  onChange,
  className,
  triggerClassName,
  inputFieldsText = defaultProps.inputFieldsText,
}: ComboBoxProps = defaultProps) {
  const [value, setValue] = React.useState(selectedItemValue ?? "")
  const [currentItemList, setCurrentItemList] = React.useState<ComboBoxItem[]>(
    [],
  )

  const { isDialogOpen, setDialogState } = useDialogueManager()

  React.useEffect(() => {
    if (typeof itemList === "function") {
      setCurrentItemList([])
      itemList().then(items => {
        setCurrentItemList(items)
      })
    } else {
      setCurrentItemList(itemList as ComboBoxItem[])
    }
  }, [itemList])

  useHotkeys("esc", () => {
    setDialogState(false)
  })
  return (
    <Popover
      open={isDialogOpen}
      onOpenChange={v => {
        setDialogState(v)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isDialogOpen}
          className={cn("w-[200px] justify-between", triggerClassName)}
          onKeyDown={v => {
            if (v.key === "Escape") {
              v.preventDefault()
              setDialogState(false)
            }
          }}
        >
          {value
            ? currentItemList.find(item => item?.value === value)?.label
            : inputFieldsText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", className)}>
        <Command className={"text-foreground bg-background"}>
          <CommandInput
            onKeyDown={v => {
              if (v.key === "Escape") {
                v.preventDefault()
                setDialogState(false)
              }
            }}
            placeholder={searchFieldPlaceholder}
          />
          <CommandList>
            <CommandEmpty>{noFieldsFoundText}</CommandEmpty>
            <CommandGroup>
              {currentItemList.map(item => (
                <CommandItem
                  key={item?.value}
                  value={item?.value}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? "" : currentValue)
                    setDialogState(false)
                    onChange(currentValue === value ? undefined : currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item?.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item?.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
