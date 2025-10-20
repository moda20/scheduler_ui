import { useCallback, useEffect, useMemo, useState } from "react"
import jobsService from "@/services/JobsService"

export interface useJobsHookProps {
  limit?: number
  offset?: number
  status?: string
  sorting?: any
}

export function useJobs({ limit, offset, status, sorting }: useJobsHookProps) {
  const [jobs, setJobs] = useState<any>([])
  const [jobsItems, setJobsItems] = useState<any>([])

  const getAllJobs = useCallback(() => {
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
      })
  }, [limit, offset, status, sorting])

  const jobsPerId = useMemo(() => {
    return jobs.reduce((p: any, c: any) => {
      p[c.id] = c
      return p
    }, {})
  }, [jobs])

  useEffect(() => {
    getAllJobs()
  }, [])

  return {
    jobs,
    jobsItems,
    jobsPerId,
  }
}
