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
