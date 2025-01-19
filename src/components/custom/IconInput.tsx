import type { ComponentProps, ReactNode, ReactElement } from "react"
import { forwardRef, cloneElement } from "react"

import { cn } from "@/lib/utils"

// Types
type IconProps = {
  icon: ReactElement
  position: "left" | "right"
}

/**
 * Input Icon
 */
const InputIcon = (props: IconProps) => {
  const { icon, position } = props
  const positionClasses = {
    left: "absolute left-1.5 top-1/2 -translate-y-1/2 transform",
    right: "absolute right-3 top-1/2 -translate-y-1/2 transform",
  }

  if (!icon) return null

  return (
    <div className={positionClasses[position]}>
      {cloneElement(icon, {
        size: 18,
        className: cn("text-[--muted-foreground]", icon.props.className),
      })}
    </div>
  )
}

type InputProps = ComponentProps<"input"> & {
  startIcon?: ReactNode
  endIcon?: ReactNode
}
/**
 * Icon
 */
export const IconInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { className, type, startIcon, endIcon, ...rest } = props

    return (
      <div className="relative w-full">
        <InputIcon icon={startIcon as ReactElement} position="left" />
        <input
          type={type}
          className={cn(
            "border-input ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border bg-[--background] px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--muted-foreground] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            { "pl-8": startIcon, "pr-8": endIcon },
            className,
          )}
          ref={ref}
          {...rest}
        />
        <InputIcon icon={endIcon as ReactElement} position="right" />
      </div>
    )
  },
)

IconInput.displayName = "Input"
