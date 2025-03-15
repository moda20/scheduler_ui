import type { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { getStringFromCronExpression } from "@/lib/utils"
import moment from "moment"

import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import ActionDropdown from "@/components/custom/jobsTable/actionDropdown"
import HeaderSortButton from "@/components/custom/jobsTable/headerSortButton"

export interface jobsTableData {
  id: string
  name: string
  status: string
  cronSetting: string
  running: boolean
  latestRun: any
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

export const defaultLogPeriod: DateRange = {
  from: subDays(new Date(), 1),
  to: new Date(),
}

export interface tableColumnsProps {
  getAvailableConsumers: () => Promise<ComboBoxItem[]>
  takeAction: (row: jobsTableData, action: jobActions, jobData?: any) => void
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
          {row.original?.latestRun?.end_time ? (
            `${moment(row.original?.latestRun?.end_time).diff(moment(row.original?.latestRun?.start_time), "minutes")} minutes`
          ) : (
            <b>Did not finish</b>
          )}
          <br />
          {row.original?.latestRun?.start_time &&
            "started :" +
              moment(row.original?.latestRun?.start_time).format(
                "YYYY-MM-DD HH:mm:ss",
              )}
          {row.original?.latestRun?.error && (
            <>
              <br />
              <Badge
                className={"m-auto"}
                variant={"destructive"}
                onClick={() => {}}
              >
                Has error
              </Badge>
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
        row={row.original}
        defaultLogPeriod={defaultLogPeriod}
        columnsProps={props}
      />
    ),
  },
]
