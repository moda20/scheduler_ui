import useDialogueManager from "@/hooks/useDialogManager"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  DockIcon,
  Edit2Icon,
  EllipsisVertical,
  FileSliders,
  LogsIcon,
  Settings,
  Trash2Icon,
} from "lucide-react"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import { JobUpdateDialog } from "@/components/job-update-dialog"
import DrawerLokiLogs from "@/components/custom/DrawerLokiLogs"
import type {
  jobsTableData,
  tableColumnsProps,
} from "@/features/jobsTable/interfaces"
import { jobActions } from "@/features/jobsTable/interfaces"
import type { DateRange } from "react-day-picker"
import DrawerJobFiles from "@/components/custom/DrawerJobFiles"
import type { ReactNode } from "react"
import React, { useCallback, useEffect } from "react"
import DropdownMenuItemExtended from "@/components/custom/general/DropdownItemExtended"
import DrawerLatestRuns from "@/components/custom/DrawerLatestRuns"
import { CardStackIcon } from "@radix-ui/react-icons"

export interface ActionDropdownProps {
  columnsProps: tableColumnsProps
  row: jobsTableData
  defaultLogPeriod: DateRange
  inputGroup?: string
  children?: ReactNode
  modal?: boolean
}
export default function ActionDropdown({
  columnsProps,
  row,
  defaultLogPeriod,
  inputGroup,
  children,
  modal,
}: ActionDropdownProps) {
  const { isDialogOpen, setDialogState } = useDialogueManager({
    inputGroup: inputGroup ?? "JobActions",
  })

  const handleMenuTriggerClick = useCallback(() => {
    setDialogState(true)
  }, [])

  const handleEscapeKeyTrigger = useCallback((v: any) => {
    if (v.key === "Escape") {
      v.preventDefault()
      setDialogState(false)
    }
  }, [])

  const handleEscapeDirectTrigger = useCallback((e: any) => {
    e.preventDefault()
    setDialogState(false)
  }, [])

  const handleEventPrevention = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  const handleConfirmationDialogAction = useCallback(
    (action: ConfirmationDialogActionType) => {
      if (action === ConfirmationDialogActionType.CANCEL) return
      columnsProps.takeAction(
        row,
        row.status === "STARTED" ? jobActions.UNSCHEDULE : jobActions.SCHEDULE,
      )
    },
    [columnsProps, row, setDialogState],
  )

  const handleConfirmationDeleteAction = useCallback(
    (action: ConfirmationDialogActionType) => {
      if (action === ConfirmationDialogActionType.CANCEL) return
      columnsProps.takeAction(row, jobActions.SOFT_DELETE)
    },
    [columnsProps, row, setDialogState],
  )

  const handleJobUpdateAction = useCallback(
    (jobData: any) => {
      return columnsProps.takeAction(row, jobActions.UPDATE, jobData)
    },
    [row],
  )

  const handleJobExecutionAction = useCallback(() => {
    if (!row.initialized && row.status === "STARTED") return
    return columnsProps.takeAction(row, jobActions.EXECUTE)
  }, [row])

  const handleJobRefresh = useCallback(() => {
    if (!row.initialized && row.status === "STARTED") return
    return columnsProps.takeAction(row, jobActions.REFRESH)
  }, [row])

  return (
    <DropdownMenu
      modal={modal ?? false}
      open={isDialogOpen}
      onOpenChange={setDialogState}
    >
      <DropdownMenuTrigger asChild onSelect={handleMenuTriggerClick}>
        {children ?? (
          <Button
            variant="ghost"
            size={"icon"}
            onKeyDown={handleEscapeKeyTrigger}
          >
            <EllipsisVertical />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-background"
        onEscapeKeyDown={handleEscapeDirectTrigger}
      >
        <DropdownMenuLabel>Config {row.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmationDialogAction
            title={
              row.status === "STARTED"
                ? "Un-schedule the job"
                : "Schedule the job"
            }
            description={
              "this action will schedule the execution of the job based on it's cron setting"
            }
            takeAction={handleConfirmationDialogAction}
            confirmText={row.status === "STARTED" ? "Un-schedule" : "Schedule"}
          >
            <DropdownMenuItemExtended keyBinding="S">
              <Settings />
              <span>
                {row.status === "STARTED" ? "deSchedule" : "Schedule"}
              </span>
              <DropdownMenuShortcut>S</DropdownMenuShortcut>
            </DropdownMenuItemExtended>
          </ConfirmationDialogAction>
          <JobUpdateDialog
            jobDetails={row}
            isCreateDialog={false}
            itemList={columnsProps.getAvailableConsumers}
            onChange={handleJobUpdateAction}
            triggerClassName="w-full"
          >
            <DropdownMenuItem onSelect={handleEventPrevention}>
              <Edit2Icon />
              <span>Update config</span>
            </DropdownMenuItem>
          </JobUpdateDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Execution</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItemExtended
            keyBinding="meta+e"
            onClick={handleJobExecutionAction}
            disabled={!row.initialized && row.status === "STARTED"}
          >
            <DockIcon />
            <span>Run now</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItemExtended>
          <DropdownMenuItemExtended
            keyBinding="R"
            onClick={handleJobRefresh}
            disabled={!row.initialized && row.status === "STARTED"}
          >
            <DockIcon />
            <span>Refresh Task File</span>
            <DropdownMenuShortcut>R</DropdownMenuShortcut>
          </DropdownMenuItemExtended>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DrawerLokiLogs
            jobName={row.name}
            start={defaultLogPeriod.from}
            end={defaultLogPeriod.to}
            trigger={
              <DropdownMenuItemExtended
                keyBinding="L"
                onSelect={handleEventPrevention}
              >
                <LogsIcon />
                <span>Latest Logs</span>
                <DropdownMenuShortcut>L</DropdownMenuShortcut>
              </DropdownMenuItemExtended>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DrawerJobFiles
            JobDetails={row}
            trigger={
              <DropdownMenuItemExtended
                keyBinding="O"
                onSelect={handleEventPrevention}
              >
                <FileSliders />
                <span>Output Files</span>
                <DropdownMenuShortcut>O</DropdownMenuShortcut>
              </DropdownMenuItemExtended>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DrawerLatestRuns
            JobDetails={row}
            trigger={
              <DropdownMenuItemExtended
                keyBinding="P"
                onSelect={handleEventPrevention}
              >
                <CardStackIcon />
                <span>Previous Runs</span>
                <DropdownMenuShortcut>P</DropdownMenuShortcut>
              </DropdownMenuItemExtended>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmationDialogAction
            title={`Delete Job : ${row.name}`}
            description={
              "This action will un-schedule and set to inactive the job but will NOT stop it if it's running"
            }
            takeAction={handleConfirmationDeleteAction}
          >
            <DropdownMenuItem
              className={"bg-destructive"}
              onSelect={handleEventPrevention}
            >
              <Trash2Icon />
              <span>Delete job</span>
            </DropdownMenuItem>
          </ConfirmationDialogAction>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
