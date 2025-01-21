import type { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { getStringFromCronExpression } from "@/lib/utils"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  Cloud,
  CreditCard,
  DockIcon,
  Edit2Icon,
  EllipsisVertical,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  LogsIcon,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  Trash2Icon,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import { CaretSortIcon, StopIcon } from "@radix-ui/react-icons"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import { JobUpdateDialog } from "@/components/job-update-dialog"
import DrawerLokiLogs from "@/components/custom/DrawerLokiLogs"
import { subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { ComboBoxItem } from "@/components/ui/combo-box"

export interface jobsTableData {
  id: string
  name: string
  status: string
  cronSetting: string
  running: boolean
  lastRun: string
  latestError?: any
  logs?: any
  consumer?: string
  averageTime?: number
  param: string
}

export enum jobActions {
  SCHEDULE,
  UNSCHEDULE,
  EXECUTE,
  EXECUTE_IN_THE_BACKGROUND,
  UPDATE,
  CREATE,
  SOFT_DELETE,
  STOP,
}

const defaultLogPeriod: DateRange = {
  from: subDays(new Date(), 1),
  to: new Date(),
}

export interface tableColumnsProps {
  getAvailableConsumers: () => Promise<ComboBoxItem[]>
  takeAction: (
    row: Row<jobsTableData>,
    action: jobActions,
    jobData?: any,
  ) => void
}

export const getTableColumns = (
  props: tableColumnsProps,
): ColumnDef<jobsTableData>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "cronSetting",
    cell: ({ row }) => (
      <div className="text-left" style={{ maxWidth: "200px" }}>
        <div>{getStringFromCronExpression(row.getValue("cronSetting"))}</div>
        <br />
        <small>{row.getValue("cronSetting")}</small>
      </div>
    ),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className={"px-0"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cron setting
          {column.getCanSort() && column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
          ) : (
            <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: "scheduled",
    header: "Scheduled",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={row.original.status === "STARTED" ? null : "destructive"}
        >
          {row.original.status === "STARTED" ? "Started" : "Stopped"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "running",
    header: "Running ?",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={row.getValue("running") ? null : "destructive"}>
          {row.getValue("running") ? "Yes" : "No"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "averageTime",
    header: "Average time",
    cell: ({ row }) => (
      <div>{Math.ceil((row.original?.averageTime ?? 0) / 60)} minutes</div>
    ),
  },
  {
    accessorKey: "lastRun",
    header: "Latest run",
    cell: ({ row }) => {
      return (
        <div className="text-left">
          {row.original?.logs?.end_time ? (
            `${moment(row.original?.logs?.end_time).diff(moment(row.original?.logs?.start_time), "minutes")} minutes`
          ) : (
            <b>Did not finish</b>
          )}
          <br />
          {"started :" +
            moment(row.original?.logs?.start_time).format(
              "YYYY-MM-DD HH:mm:ss",
            )}
          {row.original?.logs?.latestError && (
            <>
              <br />
              <Button className={"m-auto"} onClick={() => {}}>
                Error log
              </Button>
            </>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background">
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
                props.takeAction(
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
                  {row.original.status === "STARTED"
                    ? "deSchedule"
                    : "Schedule"}
                </span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </ConfirmationDialogAction>
            <JobUpdateDialog
              jobDetails={row.original}
              isCreateDialog={false}
              itemList={props.getAvailableConsumers}
              onChange={jobData => {
                props.takeAction(row, jobActions.UPDATE, jobData)
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
              onClick={() => props.takeAction(row, jobActions.EXECUTE)}
            >
              <DockIcon />
              <span>Run now</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                props.takeAction(row, jobActions.EXECUTE_IN_THE_BACKGROUND)
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
                props.takeAction(row, jobActions.SOFT_DELETE)
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
    ),
  },
]
