import type { JobEventTypes } from "@/models/jobs"
import axios from "@/lib/httpUtils"
import type { DateRange } from "react-day-picker"

export const getEvents = ({
  jobId,
  eventTypes,
  limit,
  offset,
  jobLogId,
  unhandled,
  period,
}: {
  jobId?: string | string[]
  eventTypes: JobEventTypes[]
  limit?: number
  offset?: number
  jobLogId?: string
  unhandled?: boolean
  period?: DateRange
}) => {
  return axios.get("/events/readEvents", {
    params: {
      job_id: jobId,
      type: eventTypes,
      limit,
      offset,
      job_log_id: jobLogId,
      unhandled,
      dateFrom: period?.from,
      dateTo: period?.to,
    },
  })
}

export const handleEvents = (eventIds?: string[]) => {
  return axios.put("/events/setToRead", {
    ids: eventIds,
  })
}

export const handleAllEvents = () => {
  return axios.put("/events/serAllEventsToRead")
}

export const getEventStats = (
  period?: number,
  dateRange?: DateRange,
): Promise<any> => {
  return axios.get("/events/eventMetrics", {
    params: {
      period,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
    },
  })
}

export const getEventsPerJob = (
  dateRange?: DateRange,
  jobIds?: Array<any>,
  limit?: number,
  offset?: number,
  sorting?: { id: string; desc: string }[],
): Promise<any> => {
  return axios.get("/events/eventsPerJob", {
    params: {
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      jobIds,
      limit,
      offset,
      sorting,
    },
  })
}
