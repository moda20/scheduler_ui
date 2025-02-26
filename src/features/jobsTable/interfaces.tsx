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
import useDialogueManager from "@/hooks/useDialogManager"
import ActionDropdown from "@/components/custom/jobsTable/actionDropdown"
import HeaderSortButton from "@/components/custom/jobsTable/headerSortButton"

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
    header: ({ column }) => (
      <HeaderSortButton column={column} columnName="Id" className="" />
    ),
    cell: ({ row }) => <div className="px-2">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "cronSetting",
    cell: ({ row }) => (
      <div
        className="text-left flex flex-col gap-2 max-w-[200px]"
        style={{ maxWidth: "200px" }}
      >
        <div>{getStringFromCronExpression(row.getValue("cronSetting"))}</div>
        <small>{row.getValue("cronSetting")}</small>
      </div>
    ),
    header: ({ column }) => (
      <HeaderSortButton column={column} columnName="Cron setting" />
    ),
  },
  {
    accessorKey: "scheduled",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={row.original.status === "STARTED" ? null : "destructive"}
        >
          {row.original.status === "STARTED" ? "Started" : "Stopped"}
        </Badge>
      </div>
    ),
    header: ({ column }) => (
      <HeaderSortButton column={column} columnName="Scheduled" />
    ),
  },
  {
    accessorKey: "running",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={row.getValue("running") ? null : "destructive"}>
          {row.getValue("running") ? "Yes" : "No"}
        </Badge>
      </div>
    ),
    header: ({ column }) => (
      <HeaderSortButton column={column} columnName="Running ?" />
    ),
  },
  {
    accessorKey: "averageTime",
    cell: ({ row }) => (
      <div>{Math.ceil((row.original?.averageTime ?? 0) / 60)} minutes</div>
    ),
    header: ({ column }) => (
      <HeaderSortButton column={column} columnName="Average time" />
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
      <ActionDropdown
        row={row}
        defaultLogPeriod={defaultLogPeriod}
        columnsProps={props}
      />
    ),
  },
]
