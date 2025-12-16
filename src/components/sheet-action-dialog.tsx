import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import type React from "react"
import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"

export interface SheetActionDialogProps
  extends React.ComponentProps<typeof Sheet> {
  side: "left" | "right"
  title: string
  description?: string | null
  trigger: ReactNode
  children?: ReactNode
  contentClassName?: string
  innerContainerClassName?: string
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

const defaultSheetActionDialogProps: SheetActionDialogProps = {
  side: "right",
  title: "",
  description: null,
  trigger: null,
  children: null,
  contentClassName: "",
  onOpenChange: () => {},
  modal: false,
}

export default function SheetActionDialog(
  props: SheetActionDialogProps = defaultSheetActionDialogProps,
) {
  const ref = useRef<HTMLDivElement>(null)
  const { isDialogOpen, setDialogState } = useDialogueManager()

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus()
    }, 100)
  }, [])
  return (
    <Sheet
      key={props.side}
      open={isDialogOpen}
      onOpenChange={v => setDialogState(v, props.onOpenChange)}
      modal={props.modal}
    >
      <SheetTrigger
        asChild
        onClick={() => setDialogState(true, props.onOpenChange)}
      >
        {props.trigger}
      </SheetTrigger>
      <SheetContent
        ref={ref}
        onEscapeKeyDown={v => setDialogState(false, props.onOpenChange)}
        side={props.side}
        className={cn("text-foreground bg-background", props.contentClassName)}
      >
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>{props.description}</SheetDescription>
        </SheetHeader>
        <div
          className={cn(
            "h-full pb-8 flex flex-col",
            props.innerContainerClassName,
          )}
        >
          {props.children}
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
