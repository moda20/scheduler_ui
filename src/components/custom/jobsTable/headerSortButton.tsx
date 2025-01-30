import { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons"

export interface HeaderSortButtonProps {
  column: Column<any>
  columnName: string
}

export default function HeaderSortButton(props: HeaderSortButtonProps) {
  const { column, columnName } = props
  return (
    <Button
      variant="ghost"
      className={"px-2 flex flex-row gap-0.5"}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {columnName}
      {column.getCanSort() && column.getIsSorted() === "desc" ? (
        <CaretDownIcon className="ml-2 size-4" aria-hidden="true" />
      ) : column.getIsSorted() === "asc" ? (
        <CaretUpIcon className="ml-2 size-4" aria-hidden="true" />
      ) : (
        <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
      )}
    </Button>
  )
}
