import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Unlock } from "lucide-react"
import { cn } from "@/lib/utils"

interface hoverScreenComponentProps extends React.ComponentProps<"div"> {
  hoverComponent?: React.ReactNode
}

export default function HoverScreenComponent({
  children,
  hoverComponent,
}: hoverScreenComponentProps) {
  const [isHovering, setIsHovering] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <div
        className={cn(
          "transition-opacity duration-200 absolute inset-0 rounded-lg flex items-center justify-center",
          isHovering ? "bg-gray-500/20" : "",
        )}
      >
        <div
          className={cn(
            "transition-opacity duration-200 w-auto",
            isHovering ? "opacity-100" : "opacity-0",
          )}
        >
          {hoverComponent}
        </div>
      </div>
    </div>
  )
}
