import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ListBulletIcon } from "@radix-ui/react-icons"

export function VersionSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-4"
        >
          <div className="flex border-primary border-2 aspect-square size-12 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
            <img
              src="/images/TypeSchedulerLogoSimplified.png"
              className="size-9"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">TypeScheduler</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
