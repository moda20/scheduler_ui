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
import ButtonWithStrCut, {
  ButtonWithStrCutProps,
} from "@/components/custom/general/ButtonWithStrCut"

interface ButtonWithTooltipProps extends ButtonWithStrCutProps {
  tooltipContent: React.ReactNode
  tooltipContentClassName?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  tooltipDelay?: number
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
      tooltipSide = "top",
      tooltipDelay = 700,
      ...props
    },
    ref,
  ) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={tooltipDelay}>
          <TooltipTrigger asChild>
            <ButtonWithStrCut
              ref={ref}
              className={cn(className)}
              variant={variant}
              type={type}
              {...props}
            >
              {children}
            </ButtonWithStrCut>
          </TooltipTrigger>
          <TooltipContent
            className={cn(tooltipContentClassName)}
            side={tooltipSide}
          >
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
)

ButtonWithTooltip.displayName = "ButtonWithTooltip"

export { ButtonWithTooltip }
