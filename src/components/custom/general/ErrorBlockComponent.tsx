import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import HoverScreenComponent from "@/components/custom/general/HoverScreenComponent"
import { useCallback, useState } from "react"

export interface ErrorBlockComponentProps {
  children: React.ReactNode
  hasError?: boolean
  onClear?: () => void
}

export default function ErrorBlockComponent({
  onClear,
  children,
  hasError = true,
}: ErrorBlockComponentProps) {
  const [visibleBlock, setVisibleBlock] = useState(hasError)
  const clearError = useCallback(() => {
    setVisibleBlock(false)
    onClear?.()
  }, [onClear])

  return (
    visibleBlock && (
      <HoverScreenComponent
        hoverComponent={
          <div
            className={"flex flex-col gap-2 items-center justify-center p-2"}
          >
            <Button variant="outline" size="sm" onClick={clearError}>
              <Trash2Icon className="h-4 w-4" /> clear
            </Button>
          </div>
        }
      >
        <div className="border-destructive border rounded p-2 text-red-400 text-sm bg-background">
          {children}
        </div>
      </HoverScreenComponent>
    )
  )
}
