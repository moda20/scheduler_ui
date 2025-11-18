import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCallback, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { JobEventsActionDropdown } from "@/components/custom/dashboard/JobEventsActionDropdown"

export const columns = ({ reset }: { reset?: () => void }) => {
  return [
    {
      accessorKey: "job_name",
      header: "Job",
      headerName: "Job",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.job_name}</div>
      ),
    },
    {
      accessorKey: "events",
      id: "events",
      headerName: "All events",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            All
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase mx-4">{row.original.events}</div>
      ),
    },
    {
      accessorKey: "ERROR",
      headerName: "Errors",
      id: "ERROR",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Error evs.
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge variant="destructive" className="lowercase mx-4">
          {row.original.errors}
        </Badge>
      ),
    },
    {
      accessorKey: "WARNING",
      headerName: "Warnings",
      id: "WARNING",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Warning evs.
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge className="lowercase bg-yellow-500 mx-4">
          {row.original.warnings}
        </Badge>
      ),
    },
    {
      accessorKey: "INFO",
      headerName: "Infos",
      id: "INFO",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Info evs.
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge className="lowercase bg-blue-500 mx-4">
          {row.original.info}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row, table }) => {
        const job = row.original
        return <JobEventsActionDropdown row={job} onChange={reset} />
      },
    },
  ] as ColumnDef<any>[]
}

export interface JobEventsTableProps {
  events: any[]
  totalCount: number
  pagination?: PaginationState
  setPagination?: OnChangeFn<PaginationState>
  sorting?: { id: string; desc: boolean }[]
  setSorting?: OnChangeFn<{ id: string; desc: boolean }[]>
  resetTable?: () => void
}
export function JobEventsTable({
  pagination,
  events,
  setPagination,
  totalCount,
  sorting,
  setSorting,
  resetTable,
}: JobEventsTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const reset = useCallback(() => {
    resetTable?.()
  }, [resetTable])

  const memoizedColumns = React.useMemo(() => columns({ reset }), [reset])

  const table = useReactTable({
    data: events,
    columns: memoizedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
    rowCount: totalCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })
  return (
    <div className="w-full">
      <div className="flex items-center py-4 border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={column.toggleVisibility}
                  >
                    {(column.columnDef as any).headerName}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={"border-border"}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {useMemo(() => {
            return (
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={"border-border"}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )
          }, [events])}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {totalCount} Jobs with unhandled events
        </div>
        {useMemo(() => {
          return (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={table.previousPage}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={table.nextPage}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          )
        }, [table, pagination, totalCount])}
      </div>
    </div>
  )
}
