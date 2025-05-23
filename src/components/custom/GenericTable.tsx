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

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  events?: {
    onPageChange: ({ sorting }: { sorting: SortingState }) => void
    actionConfirmed: () => void
  }
  filters?: {
    sorting: SortingState
  }
}

export function GenericTable<TData>({
  columns,
  data,
  events,
  filters,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    filters?.sorting ?? [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: v => {
      setSorting(v)
      events?.onPageChange({
        sorting: typeof v === "function" ? v([]) : v,
      })
    },
    state: {
      sorting,
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
