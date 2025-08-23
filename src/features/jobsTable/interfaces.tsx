import type { ColumnDef, Row, Table } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { getStringFromCronExpression } from "@/lib/utils"
import moment from "moment"

import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import ActionDropdown from "@/components/custom/jobsTable/actionDropdown"
import HeaderSortButton from "@/components/custom/jobsTable/headerSortButton"
import { FileArchive, LucideFileWarning } from "lucide-react"
import React, { useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

export interface jobsTableData {
  id: string
  name: string
  status: string
  cronSetting: string
  isCurrentlyRunning: boolean
  latestRun: any
  latestError?: any
  logs?: any
  consumer?: string
  averageTime?: number
  param: string
  initialized?: boolean
}

export enum jobActions {
  SCHEDULE,
  UNSCHEDULE,
  EXECUTE,
  EXECUTE_IN_THE_BACKGROUND,
  REFRESH,
  UPDATE,
  CREATE,
  SOFT_DELETE,
  STOP,
  EXECUTE_WITH_PARAMS,
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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected() || row.getIsSomeSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label={`Select row ${row.original.name}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ row }) => (
      <div className="px-2 flex flex-col gap-2">
        <span className="font-extrabold">{row.original.name}</span>
        {!row.original.initialized && row.original.status === "STARTED" && (
          <div className="flex gap-2 text-[12px] items-center text-yellow-500 font-bold">
            <LucideFileWarning size="14" className="" />
            Initializing Error
          </div>
        )}
        {
          <div className="flex gap-2 text-[13px] items-center font-light">
            <FileArchive size="14" className="" />
            {row.original.consumer}
          </div>
        }
      </div>
    ),
  },
  {
    accessorKey: "cronSetting",
    cell: ({ row }) => (
      <div className="text-left flex flex-col gap-2 max-w-[200px]">
        <div>{getStringFromCronExpression(row.original.cronSetting)}</div>
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
    accessorKey: "isCurrentlyRunning",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Badge
            variant={row.original.isCurrentlyRunning ? null : "destructive"}
          >
            {row.original.isCurrentlyRunning ? "Yes" : "No"}
          </Badge>
        </div>
      )
    },
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
    accessorKey: "latestRun",
    header: ({ column }) => (
      <HeaderSortButton column={column} columnName="Latest run" />
    ),
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
              <Badge className={"m-auto"} variant={"destructive"}>
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
