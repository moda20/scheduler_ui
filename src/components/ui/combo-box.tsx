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
import { useCallback, useEffect, useId } from "react"
import { useHotkeys } from "react-hotkeys-hook"

export interface ComboBoxItemInterface {
  value: string
  label: string
}

export type ComboBoxItem = ComboBoxItemInterface
export interface ComboBoxProps {
  itemList: ComboBoxItem[] | (() => Promise<ComboBoxItem[]>)
  selectedItemValue?: string | Array<string> | null
  searchFieldPlaceholder?: string
  noFieldsFoundText?: string
  inputFieldsText?: string
  className?: string
  triggerClassName?: string
  onChange: (value?: string | Array<string>) => void
  multiSelect?: boolean
  managed?: boolean
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
  multiSelect: false,
}

export interface ComboButtonBoxRendererProps {
  selectedValue?: string | Array<string>
  itemList: ComboBoxItem[]
  defaultInputText?: string
  multiSelect?: boolean
  mappedInputList: Record<string, ComboBoxItem>
}

const ComboButtonBoxRenderer = ({
  selectedValue,
  itemList,
  defaultInputText,
  multiSelect,
  mappedInputList,
}: ComboButtonBoxRendererProps) => {
  return multiSelect ? (
    <div className="flex gap-1 items-center justify-between w-full">
      <span className="flex gap-0.5">
        {(selectedValue as Array<string>).slice(0, 3).map(v => (
          <span
            key={v}
            className="w-[80px] p-1 overflow-clip overflow-ellipsis"
          >
            {mappedInputList[v]?.label}
          </span>
        ))}
      </span>
      <span className="items-center gap-1 rounded border border-border bg-gray-100 bg-opacity-20 px-1.5 font-mono text-[15px] font-bold">
        {selectedValue?.length}
      </span>
    </div>
  ) : (
    <span>
      {selectedValue
        ? itemList.find(item => item?.value === selectedValue)?.label
        : defaultInputText}
    </span>
  )
}

const parseInputSelectedItems = (
  selectedItemValue?: string | string[] | null,
) => {
  if (Array.isArray(selectedItemValue)) {
    return selectedItemValue.map(e => `${e}`)
  }
  return selectedItemValue?.toString()
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
  multiSelect,
  managed,
}: ComboBoxProps = defaultProps) {
  const [value, setValue] = React.useState<string | Array<string>>(
    parseInputSelectedItems(selectedItemValue) ?? (multiSelect ? [] : ""),
  )

  const [currentItemList, setCurrentItemList] = React.useState<ComboBoxItem[]>(
    [],
  )
  const { isDialogOpen, setDialogState } = useDialogueManager()

  useEffect(() => {
    if (managed) {
      const newValue =
        parseInputSelectedItems(selectedItemValue) ?? (multiSelect ? [] : "")
      setValue(newValue)
    }
  }, [selectedItemValue])

  const setSelectedValue = useCallback(
    (currentValue: string) => {
      if (multiSelect && Array.isArray(value)) {
        const newValue = value.includes(currentValue)
          ? value.filter(e => e !== currentValue)
          : [...value, currentValue]
        setValue(newValue)
        onChange(newValue)
      } else {
        setValue(currentValue === value ? "" : currentValue)
        onChange(currentValue === value ? undefined : currentValue)
        setDialogState(false)
      }
    },
    [multiSelect, onChange, value, setDialogState],
  )
  const mappedInputList = React.useMemo(() => {
    return currentItemList.reduce(
      (acc, cur) => {
        acc[cur!.value ?? ""] = cur
        return acc
      },
      {} as Record<string, ComboBoxItem>,
    )
  }, [currentItemList])

  const isSelectedValue = useCallback(
    (currentValue: string) => {
      if (multiSelect) {
        return Array.isArray(value) ? value.includes(currentValue) : false
      }
      return value === currentValue
    },
    [multiSelect, value],
  )

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
          {ComboButtonBoxRenderer({
            selectedValue: value,
            itemList: currentItemList,
            defaultInputText: inputFieldsText,
            multiSelect,
            mappedInputList,
          })}
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
                  key={item.value}
                  keywords={[item.label, item.value]}
                  value={item?.value}
                  onSelect={currentValue => setSelectedValue(currentValue)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelectedValue(item.value) ? "opacity-100" : "opacity-0",
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
