import type { jobsTableData } from "@/features/jobsTable/interfaces"
import type { ForwardedRef } from "react"

export interface JobsRunningData {
  runningJobsCount: number
  jobEvents: { [key: string]: any }
}

export interface JobRunLog {
  log_id: string
  job_id: string
  start_time: Date
  end_time: Date
  result: string | null
  error: string | null
}

export interface JobRunsQuerySchema {
  jobId?: string
  limit?: number
  offset?: number
}

export enum JobEventTypes {
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
}

export interface EventItemProps {
  timestamp: string
  message: string
  type?: JobEventTypes
  className?: string
  handled?: boolean
  onHandle?: () => void
  handleTime?: string
  job?: jobsTableData
  ref?: ForwardedRef<never>
}

export const eventTypeColors = {
  [JobEventTypes.ERROR]: {
    border: "border-red-500",
    text: "text-red-500",
    bg: "hover:bg-red-500/5",
    focus: "focus:bg-red-50/5",
  },
  [JobEventTypes.INFO]: {
    border: "border-blue-500",
    text: "text-blue-500",
    bg: "hover:bg-blue-500/5",
    focus: "focus:bg-blue-500/5",
  },
  [JobEventTypes.WARNING]: {
    border: "border-orange-500",
    text: "text-orange-500",
    bg: "hover:bg-orange-500/5",
    focus: "focus:bg-orange-500/5",
  },
}
