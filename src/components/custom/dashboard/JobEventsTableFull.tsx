import * as React from "react"
import type { PaginationState } from "@tanstack/react-table"
import { useJobs } from "@/hooks/useJobs"
import { useCallback } from "react"
import { JobEventsTable } from "@/components/custom/dashboard/JobEventsTable"

export function JobEventsTableFull() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = React.useState<any>([
    { id: "events", desc: true },
  ])

  const { eventsPerJobs } = useJobs({
    getJobEvents: true,
    jobEventsPagination: pagination,
    jobEventsSorting: sorting,
  })

  const resetTable = useCallback(() => {
    setSorting([...sorting]) // we use sorting to reset the table, as it is taken fully into consideration at the useJob hook
  }, [sorting])

  return (
    <JobEventsTable
      events={eventsPerJobs.events}
      totalCount={eventsPerJobs.total}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      resetTable={resetTable}
    />
  )
}
