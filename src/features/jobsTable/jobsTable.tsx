import type { ColumnDef, SortingState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import * as React from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  events: {
    onPageChange: ({ sorting }: { sorting: SortingState }) => void
    actionConfirmed: () => void
  }
  filters: {
    sorting: SortingState
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  events,
  filters,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: v => {
      events.onPageChange({
        sorting: typeof v === "function" ? v(filters.sorting) : v,
      })
    },
    state: {
      sorting: filters.sorting,
    },
  })

  return (
    <div className="rounded-md border border-border w-full">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
