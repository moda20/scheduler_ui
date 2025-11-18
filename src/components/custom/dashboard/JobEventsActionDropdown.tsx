import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import { useCallback, useMemo } from "react"
import { changeRoute, routes } from "@/app/reducers/uiReducer"
import { useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useJobEvents } from "@/hooks/useJobEvents"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import { toast } from "@/hooks/use-toast"

export interface JobEventsActionDropdownProps {
  row: any
  onChange?: () => void
}

export function JobEventsActionDropdown({
  row,
  onChange,
}: JobEventsActionDropdownProps) {
  const routesList = useAppSelector(routes)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const defaultEventList = useMemo(() => {
    return []
  }, [])

  const targetJobEventsRoute = useMemo(
    () => routesList?.[1].items?.find(e => e.id === "jobEvents"),
    [routesList],
  )

  const handleEventPrevention = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  const navigateToTheEventsPageCallback = useCallback(() => {
    if (targetJobEventsRoute && routesList) {
      dispatch(changeRoute([routesList?.[1], targetJobEventsRoute]))
    }
    return navigate({
      pathname: "/jobEvents",
      search: `?jobId=${row.job_id}`,
    })
  }, [dispatch, navigate, routesList, row.job_id, targetJobEventsRoute])

  const { setAllEventsToHandled } = useJobEvents({
    jobId: "",
    eventTypes: defaultEventList,
    limit: 1,
    offset: 0,
    enableEventViaREST: false,
  })

  const handleAllJobEvents = useCallback(
    (action: ConfirmationDialogActionType) => {
      if (action === ConfirmationDialogActionType.CONFIRM) {
        setAllEventsToHandled(row.job_id)
          .then(() => {
            toast({
              title: "All events marked as read",
              duration: 2000,
            })
            onChange?.()
          })
          .catch(err => {
            console.log(err)
            toast({
              title: err.message,
              variant: "destructive",
            })
          })
      }
    },
    [row, setAllEventsToHandled],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={navigateToTheEventsPageCallback}>
          View Events
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmationDialogAction
          title="Mark all events as handled"
          description={`This action is UNDOABLE, All ${row.events} events for ${row.job_name} will be marked as handled`}
          takeAction={handleAllJobEvents}
          confirmText="Mark All as Read"
          autoFocus={true}
          confirmVariant="destructive"
        >
          <DropdownMenuItem onSelect={handleEventPrevention}>
            Mark all as handled
          </DropdownMenuItem>
        </ConfirmationDialogAction>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
