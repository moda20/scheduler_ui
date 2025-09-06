import React from "react"
import type { ButtonProps } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ButtonWithTooltipProps extends ButtonProps {
  tooltipContent: React.ReactNode
  tooltipContentClassName?: string
}

const ButtonWithTooltip = React.forwardRef<
  HTMLButtonElement,
  ButtonWithTooltipProps
>(
  (
    {
      children,
      className,
      tooltipContent,
      tooltipContentClassName,
      variant,
      type,
      ...props
    },
    ref,
  ) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              className={cn(className)}
              variant={variant}
              type={type}
              {...props}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent className={cn(tooltipContentClassName)}>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
)

ButtonWithTooltip.displayName = "ButtonWithTooltip"

export { ButtonWithTooltip }
