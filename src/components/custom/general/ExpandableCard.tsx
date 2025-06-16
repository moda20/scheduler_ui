"use client"

import React, { useCallback } from "react"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableCardProps {
  children: React.ReactNode
  expandedContent: React.ReactNode
  onExpandedChange?: (expanded: boolean) => void
  className?: string
  mainContentClassName?: string
}

export default function ExpandableCard({
  children,
  expandedContent,
  className,
  mainContentClassName,
  onExpandedChange,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const onExpandedUpdate = useCallback(
    (expanded: boolean) => {
      setIsExpanded(expanded)
      onExpandedChange?.(expanded)
    },
    [onExpandedChange],
  )

  return (
    <div
      className={cn(
        "relative transition-all duration-200 ease-in-out flex  gap-0",
        isExpanded ? "w-full" : "",
        className,
      )}
    >
      <div className={cn("flex", mainContentClassName)}>
        {/* Main content area */}
        {children}

        {/* Expanded content - shown when expanded */}
        {isExpanded && expandedContent}
      </div>

      {/* Interactive lip/tab - always at the far right */}
      <button
        type="button"
        onClick={() => onExpandedUpdate(!isExpanded)}
        className={cn(
          "h-auto w-6 flex items-center justify-center rounded-r-lg transition-all duration-200",
          isExpanded
            ? "bg-background text-foreground border border-border"
            : "bg-background hover:bg-sidebar text-foreground ",
          "focus:outline-none focus:ring focus:ring-offset-0 focus:ring-sidebar",
        )}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse card" : "Expand card"}
      >
        <div className="inset-y-0 flex items-center justify-center ">
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </button>
    </div>
  )
}
