import type { InputProps } from "@/components/ui/input"
import { Input } from "@/components/ui/input"
import { ChangeEventHandler, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface PrefixedInputProps extends InputProps {
  prefix: string
  value: string
  label?: string
  format?: string
  className?: string
  editMode?: boolean
  onValueChange?: (value: string) => void
}

export default function PrefixedInput({
  prefix,
  value,
  label,
  className,
  editMode,
  format,
  onValueChange,
  ...props
}: PrefixedInputProps) {
  const formatValue = useCallback(
    (value: string) => {
      switch (format) {
        case "boolean": {
          return value === "true" ? "Enabled" : "Disabled"
        }
        default: {
          return value
        }
      }
    },
    [format],
  )

  const booleanDropdown = useMemo(() => {
    return (
      <Select value={value} onValueChange={value => onValueChange?.(value)}>
        <SelectTrigger className="text-foreground bg-background border-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="text-foreground bg-background border-border border">
          <SelectItem className="text-foreground bg-background" value="true">
            True
          </SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    )
  }, [value, props])

  return (
    <div className="flex items-center rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow ">
      <div
        className={cn(
          "px-4 py-2.5 text-sm font-medium bg-sidebar rounded-l border-none",
          !editMode ? "opacity-50" : "",
        )}
      >
        {prefix}
      </div>
      {editMode ? (
        format === "boolean" ? (
          booleanDropdown
        ) : (
          <Input
            value={formatValue(value)}
            placeholder="Configuration key"
            className={cn(
              "border-none shadow-none focus-visible:ring-0 rounded-none px-4 py-3 text-sm",
              className,
            )}
            {...props}
          />
        )
      ) : (
        <div className="font-mono text-sm px-4 py-2.5 flex-1 text-foreground bg-background opacity-50">
          {formatValue(value)}
        </div>
      )}
    </div>
  )
}
