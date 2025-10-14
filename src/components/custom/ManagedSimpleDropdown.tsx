import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { ManagedSelectInputValue } from "@/components/custom/ManagedSelect"
import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState,
} from "react"

export type ManagedSimpleDropdownInputValue = {
  value?: string | boolean
  label: string
  selected?: boolean
}

interface ManagedSimpleDropdownProps {
  onChange: (value?: ManagedSimpleDropdownInputValue | any) => void
  defaultValue: ManagedSimpleDropdownInputValue[]
  inputOptions: Array<ManagedSimpleDropdownInputValue>
  inputPlaceholder?: string
  disabled?: boolean
  className?: string
  itemClassName?: string
  multiSelect?: boolean
  buttonProps?: ComponentPropsWithoutRef<typeof Button>
}
export function ManagedSimpleDropdown({
  className,
  itemClassName,
  onChange,
  disabled,
  inputPlaceholder,
  inputOptions,
  defaultValue,
  multiSelect,
  buttonProps,
}: ManagedSimpleDropdownProps) {
  const { isDialogOpen, setDialogState } = useDialogueManager()
  const [selectedItems, setSelectedItems] =
    useState<ManagedSimpleDropdownInputValue[]>(defaultValue)

  useEffect(() => {
    setSelectedItems(defaultValue)
  }, [defaultValue])

  const onInputSelect = useCallback(
    (selectedValue: any) => {
      setSelectedItems(prevState => {
        if (multiSelect) {
          const target = prevState.find(e => selectedValue.label === e.label)
          if (target) {
            target.selected = selectedValue.selected
          }
          return [...prevState]
        } else {
          return [selectedValue]
        }
      })
      onChange(selectedItems)
    },
    [selectedItems, onChange],
  )

  const onCheckBoxItemClicked = useCallback(
    (item: ManagedSimpleDropdownInputValue) => {
      return (inputValue: boolean) => {
        item.selected = inputValue
        return onInputSelect(item)
      }
    },
    [onInputSelect],
  )

  const onItemClicked = useCallback(
    (item: ManagedSimpleDropdownInputValue) => {
      return () => {
        return onInputSelect(item)
      }
    },
    [onInputSelect],
  )

  return (
    <div className={cn(className)}>
      <DropdownMenu open={isDialogOpen} onOpenChange={v => setDialogState(v)}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            {...buttonProps}
            className={cn(buttonProps?.className, "flex gap-2 items-center")}
          >
            <span>{inputPlaceholder}</span>
            <span>
              {selectedItems.length
                ? "+" + selectedItems.filter(e => e.selected).length
                : ""}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{inputPlaceholder}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {selectedItems.map((item, i) =>
            multiSelect ? (
              <DropdownMenuCheckboxItem
                className={cn(itemClassName, "capitalize")}
                key={i}
                checked={item.selected}
                onCheckedChange={onCheckBoxItemClicked(item)}
              >
                {item.label}
              </DropdownMenuCheckboxItem>
            ) : (
              <DropdownMenuItem
                className={cn(itemClassName, "capitalize")}
                key={i}
                onClick={onItemClicked(item)}
              >
                {item.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
