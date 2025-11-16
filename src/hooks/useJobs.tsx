import { useCallback, useEffect, useMemo, useState } from "react"
import jobsService from "@/services/JobsService"
import { getEventsPerJob } from "@/services/components/eventsService"
import type { DateRange } from "react-day-picker"
import { PaginationState } from "@tanstack/react-table"

export interface useJobsHookProps {
  limit?: number
  offset?: number
  status?: string
  sorting?: any
  getJobEvents?: boolean
  jobEventsPagination?: PaginationState
  jobEventsSorting?: { id: string; desc: string }[]
  jobEventsRange?: DateRange
}

export function useJobs({
  limit,
  offset,
  status,
  sorting,
  getJobEvents,
  jobEventsPagination,
  jobEventsSorting,
  jobEventsRange,
}: useJobsHookProps) {
  const [jobs, setJobs] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [eventsPerJobs, setEventsPerJobs] = useState<{
    events: any[]
    total: number
  }>({
    events: [],
    total: 0,
  })
  const [jobsItems, setJobsItems] = useState<any>([])

  const getAllJobs = useCallback(() => {
    setLoading(true)
    return jobsService
      .getAllJobs(sorting, status, limit, offset)
      .then((data: any) => {
        setJobs(data)
        setJobsItems(
          data.map((item: any) => {
            return {
              value: item.id?.toString(),
              label: item.name,
            }
          }),
        )
        setLoading(false)
      })
  }, [limit, offset, status, sorting])

  const jobsPerId = useMemo(() => {
    return jobs.reduce((p: any, c: any) => {
      p[c.id] = c
      return p
    }, {})
  }, [jobs])

  const getEventsPerJobs = useCallback(
    async (
      range?: DateRange,
      pagination?: PaginationState,
      sorting?: { id: string; desc: string }[],
    ) => {
      setLoading(true)
      const calculatedOffset =
        (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 0)
      const jobsPerEvents = await getEventsPerJob(
        range,
        undefined,
        pagination?.pageSize,
        calculatedOffset ?? 10,
        sorting,
      )
      setEventsPerJobs(prevState => {
        prevState.events = jobsPerEvents.data.map((e: any) => {
          e.errors = e.ERROR
          e.warnings = e.WARNING
          e.info = e.INFO
          return e
        })
        prevState.total = jobsPerEvents.total
        return prevState
      })
      setLoading(false)
    },
    [],
  )

  useEffect(() => {
    if (getJobEvents) {
      getEventsPerJobs(jobEventsRange, jobEventsPagination, jobEventsSorting)
    }
  }, [
    getJobEvents,
    jobEventsRange,
    jobEventsSorting,
    jobEventsPagination?.pageIndex, // This is a relative hack due to an infinite loop caused by tanstack table
    // emitting a pagination event that triggers an infinite rerender of the component
  ])

  useEffect(() => {
    getAllJobs()
  }, [])

  return {
    jobs,
    jobsItems,
    jobsPerId,
    loading,
    eventsPerJobs,
  }
}
