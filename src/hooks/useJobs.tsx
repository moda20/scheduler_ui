import { useCallback, useEffect, useMemo, useState } from "react"
import jobsService from "@/services/JobsService"
import { getEventsPerJob } from "@/services/components/eventsService"
import type { DateRange } from "react-day-picker"

export interface useJobsHookProps {
  limit?: number
  offset?: number
  status?: string
  sorting?: any
  getJobEvents?: boolean
  jobEventsProps?: {
    limit?: number
    offset?: number
    dateRange?: DateRange
    sorting?: { id: string; desc: string }[]
  }
}

export function useJobs({
  limit,
  offset,
  status,
  sorting,
  getJobEvents,
  jobEventsProps,
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

  const getEventsPerJobs = useCallback(async () => {
    setLoading(true)
    const jobsPerEvents = await getEventsPerJob(
      jobEventsProps?.dateRange,
      undefined,
      jobEventsProps?.limit,
      jobEventsProps?.offset,
      jobEventsProps?.sorting,
    )
    setEventsPerJobs({
      events: jobsPerEvents.data.map((e: any) => {
        e.errors = e.ERROR
        e.warnings = e.WARNING
        e.info = e.INFO
        return e
      }),
      total: jobsPerEvents.total,
    })
    setLoading(false)
  }, [jobEventsProps, jobEventsProps?.limit, jobEventsProps?.offset])

  useEffect(() => {
    if (getJobEvents) {
      getEventsPerJobs()
    }
  }, [getEventsPerJobs, getJobEvents])

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
