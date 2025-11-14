import * as React from "react"
import type { PaginationState } from "@tanstack/react-table"
import { useJobs } from "@/hooks/useJobs"
import { useCallback, useMemo } from "react"
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
    jobEventsProps: useMemo(
      () => ({
        limit: 10,
        offset: 0,
        sorting,
      }),
      [pagination.pageSize, pagination.pageIndex, sorting],
    ),
  })

  const setSortingProxy = useCallback((inS: any) => {
    const newSorting = inS(sorting)
    setSorting(newSorting)
  }, [])

  return (
    <JobEventsTable
      events={eventsPerJobs.events}
      totalCount={eventsPerJobs.total}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSortingProxy}
    />
  )
}
