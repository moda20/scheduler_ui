import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  EllipsisVertical,
  LogOutIcon,
  UserCircle,
  UserCircle2,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  ConnectionStatus,
  connectionStatus,
  disconnect,
  user,
} from "@/app/reducers/authReducer"
import useDialogueManager from "@/hooks/useDialogManager"
import { useCallback } from "react"

export default function UserDropdown() {
  const dispatch = useAppDispatch()
  const userData = useAppSelector(user)
  const targetConnectionStatus = useAppSelector(connectionStatus)

  const isAuthenticated = targetConnectionStatus === ConnectionStatus.CONNECTED

  const { isDialogOpen, setDialogState } = useDialogueManager()

  const handleMenuTriggerClick = useCallback(() => {
    setDialogState(true)
  }, [setDialogState])

  const handleEscapeKeyTrigger = useCallback(
    (v: any) => {
      if (v.key === "Escape") {
        v.preventDefault()
        setDialogState(false)
      }
    },
    [setDialogState],
  )

  const disconnectAction = useCallback(() => {
    dispatch(disconnect())
    setDialogState(false)
  }, [dispatch])
  return (
    <DropdownMenu
      modal={false}
      open={isDialogOpen}
      onOpenChange={setDialogState}
    >
      <DropdownMenuTrigger asChild onSelect={handleMenuTriggerClick}>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onKeyDown={handleEscapeKeyTrigger}
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <UserCircle className="h-8 w-8" />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {isAuthenticated ? userData!.username : ""}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {isAuthenticated ? userData!.email : ""}
            </span>
          </div>
          <EllipsisVertical className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="right"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <UserCircle className="h-8 w-8" />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {isAuthenticated ? userData!.username : ""}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {isAuthenticated ? userData!.email : ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={disconnectAction}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
