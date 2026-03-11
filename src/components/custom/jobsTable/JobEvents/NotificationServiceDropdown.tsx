import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, useEffect, useState } from "react"
import BImage from "@/components/custom/general/PublicBackendImage"
import useDialogueManager from "@/hooks/useDialogManager"

export type NotificationServiceDropdownItem = {
  value: number
  label: string
  image?: string
  description?: string
}

interface NotificationServiceDropdownProps {
  onChange: (value: NotificationServiceDropdownItem | undefined) => void
  defaultValue?: NotificationServiceDropdownItem
  inputOptions: NotificationServiceDropdownItem[]
  inputPlaceholder?: string
  disabled?: boolean
  className?: string
  buttonProps?: ComponentPropsWithoutRef<typeof Button>
}

export function NotificationServiceDropdown({
  className,
  onChange,
  disabled,
  inputPlaceholder,
  inputOptions,
  defaultValue,
  buttonProps,
}: NotificationServiceDropdownProps) {
  const { isDialogOpen, setDialogState } = useDialogueManager()

  const [value, setValue] = useState<
    NotificationServiceDropdownItem | undefined
  >(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleSelect = (item: NotificationServiceDropdownItem) => {
    setValue(item)
    onChange(item)
    setDialogState(false)
  }

  return (
    <div className={cn(className)}>
      <DropdownMenu open={isDialogOpen} onOpenChange={setDialogState}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            {...buttonProps}
            variant="outline"
            className={cn(
              buttonProps?.className,
              "w-full justify-between text-left font-normal",
            )}
          >
            {value ? (
              <div className="flex items-center gap-2">
                {value.image && (
                  <BImage
                    src={value.image}
                    alt={value.label}
                    className="h-5 w-5 rounded-md object-cover border"
                  />
                )}
                <span className="truncate">{value.label}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {inputPlaceholder || "Select notification service"}
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[300px] text-foreground bg-background"
          onEscapeKeyDown={e => {
            e.preventDefault()
            setDialogState(false)
          }}
        >
          <DropdownMenuLabel>
            {inputPlaceholder || "Select notification service"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {inputOptions.map(item => (
            <DropdownMenuItem
              key={item.value}
              onSelect={() => handleSelect(item)}
              className="flex items-center gap-3 cursor-pointer"
            >
              {item.image && (
                <BImage
                  src={item.image}
                  alt={item.label}
                  className="h-8 w-8 rounded-md object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
