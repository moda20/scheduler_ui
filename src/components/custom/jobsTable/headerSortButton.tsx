import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export interface HeaderSortButtonProps {
  column: Column<any>
  columnName: string
  className?: string
}

export default function HeaderSortButton(props: HeaderSortButtonProps) {
  const { column, columnName, className } = props
  return (
    <Button
      variant="ghost"
      className={cn("px-2 flex flex-row gap-1", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {columnName}
      {column.getCanSort() && column.getIsSorted() === "desc" ? (
        <CaretDownIcon className=" size-4" aria-hidden="true" />
      ) : column.getIsSorted() === "asc" ? (
        <CaretUpIcon className="size-4" aria-hidden="true" />
      ) : (
        <CaretSortIcon className="size-4" aria-hidden="true" />
      )}
    </Button>
  )
}
