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
import type { Row } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

export interface ActionDropdownProps {
  columnsProps: tableColumnsProps
  row: Row<jobsTableData>
  defaultLogPeriod: DateRange
}
export default function ActionDropdown({
  columnsProps,
  row,
  defaultLogPeriod,
}: ActionDropdownProps) {
  const { isDialogOpen, setDialogState } = useDialogueManager({
    inputGroup: "JobActions",
  })

  return (
    <DropdownMenu
      modal={false}
      open={isDialogOpen}
      onOpenChange={v => setDialogState(v)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          onKeyDown={v => {
            if (v.key === "Escape") {
              v.preventDefault()
              setDialogState(false)
            }
          }}
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false)
        }}
      >
        <DropdownMenuLabel>Config {row.original?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmationDialogAction
            title={
              row.original.status === "STARTED"
                ? "un-Scheduele the job"
                : "Schedule the job"
            }
            description={
              "this action will schedule the execution of the job based on it's cron setting"
            }
            takeAction={action => {
              if (action === ConfirmationDialogActionType.CANCEL) return
              columnsProps.takeAction(
                row,
                row.original.status === "STARTED"
                  ? jobActions.UNSCHEDULE
                  : jobActions.SCHEDULE,
              )
            }}
          >
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Settings />
              <span>
                {row.original.status === "STARTED" ? "deSchedule" : "Schedule"}
              </span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ConfirmationDialogAction>
          <JobUpdateDialog
            jobDetails={row.original}
            isCreateDialog={false}
            itemList={columnsProps.getAvailableConsumers}
            onChange={jobData => {
              columnsProps.takeAction(row, jobActions.UPDATE, jobData)
            }}
          >
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Edit2Icon />
              <span>Update config</span>
            </DropdownMenuItem>
          </JobUpdateDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Execution</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => columnsProps.takeAction(row, jobActions.EXECUTE)}
          >
            <DockIcon />
            <span>Run now</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              columnsProps.takeAction(row, jobActions.EXECUTE_IN_THE_BACKGROUND)
            }
          >
            <DockIcon />
            <span>Run in background</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DrawerLokiLogs
            jobName={row.original.name}
            start={defaultLogPeriod.from}
            end={defaultLogPeriod.to}
            trigger={
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <LogsIcon />
                <span>Latest Logs</span>
              </DropdownMenuItem>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmationDialogAction
            title={`Delete Job : ${row.original.name}`}
            description={
              "This action will un-schedule and set to inactive the job but will NOT stop it if it's running"
            }
            takeAction={action => {
              if (action === ConfirmationDialogActionType.CANCEL) return
              columnsProps.takeAction(row, jobActions.SOFT_DELETE)
            }}
          >
            <DropdownMenuItem
              className={"bg-destructive"}
              onSelect={e => e.preventDefault()}
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
