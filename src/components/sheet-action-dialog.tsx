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

export interface SheetActionDialogProps
  extends React.ComponentProps<typeof Sheet> {
  side: "left" | "right"
  title: string
  description?: string | null
  trigger: ReactNode
  children?: ReactNode
  contentClassName?: string
  onOpenChange?: (open: boolean) => void
}

const defalutSheetActionDialogProps: SheetActionDialogProps = {
  side: "right",
  title: "",
  description: null,
  trigger: null,
  children: null,
  contentClassName: "",
  onOpenChange: () => {},
}

export default function SheetActionDialog(
  props: SheetActionDialogProps = defalutSheetActionDialogProps,
) {
  return (
    <Sheet key={props.side} onOpenChange={props.onOpenChange}>
      <SheetTrigger asChild>{props.trigger}</SheetTrigger>
      <SheetContent
        onEscapeKeyDown={v =>
          props.onOpenChange ? props.onOpenChange(false) : () => {}
        }
        side={props.side}
        className={cn("text-foreground bg-background", props.contentClassName)}
      >
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>{props.description}</SheetDescription>
        </SheetHeader>
        <div className="h-full pb-8 flex flex-col">{props.children}</div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
