import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarCloseIcon } from "lucide-react"
import type { ReactNode } from "react"
import type React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useId, useState } from "react"
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
}

const defaultSheetActionDialogProps: SheetActionDialogProps = {
  side: "right",
  title: "",
  description: null,
  trigger: null,
  children: null,
  contentClassName: "",
  onOpenChange: () => {},
}

export default function SheetActionDialog(
  props: SheetActionDialogProps = defaultSheetActionDialogProps,
) {
  const { isDialogOpen, setDialogState } = useDialogueManager()

  return (
    <Sheet
      key={props.side}
      open={isDialogOpen}
      onOpenChange={v => setDialogState(v, props.onOpenChange)}
    >
      <SheetTrigger
        asChild
        onClick={() => setDialogState(true, props.onOpenChange)}
      >
        {props.trigger}
      </SheetTrigger>
      <SheetContent
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
