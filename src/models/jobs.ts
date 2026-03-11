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

export const eventPeriodUnits: { [key: string]: number } = {
  min: 1,
  h: 60,
  d: 1440,
  m: 43200,
}

export enum JobNotificationTypes {
  JOB_EVENT = "JOB_EVENT",
  JOB_EVENT_ERROR = "JOB_EVENT_ERROR",
  JOB_EVENT_WARNING = "JOB_EVENT_WARNING",
  JOB_EVENT_INFO = "JOB_EVENT_INFO",
  JOB_DURATION = "JOB_DURATION",
}

export const JNTypesNames = {
  [JobNotificationTypes.JOB_EVENT]: "Job Event",
  [JobNotificationTypes.JOB_EVENT_ERROR]: "Job Event Error",
  [JobNotificationTypes.JOB_EVENT_WARNING]: "Job Event Warning",
  [JobNotificationTypes.JOB_EVENT_INFO]: "Job Event Info",
  [JobNotificationTypes.JOB_DURATION]: "Job Duration",
}

export enum JobNotificationTriggers {
  REGEX_MESSAGE_MATCH = "REGEX_MESSAGE_MATCH",
  DURATION_DELTA = "DURATION_DELTA",
  DURATION_THRESHOLD = "DURATION_THRESHOLD",
}

export const AvailableTypesPerTrigger = {
  [JobNotificationTriggers.REGEX_MESSAGE_MATCH]: [
    JobNotificationTypes.JOB_EVENT_ERROR,
    JobNotificationTypes.JOB_EVENT_WARNING,
    JobNotificationTypes.JOB_EVENT_INFO,
  ],
  [JobNotificationTriggers.DURATION_DELTA]: [JobNotificationTypes.JOB_DURATION],
  [JobNotificationTriggers.DURATION_THRESHOLD]: [
    JobNotificationTypes.JOB_DURATION,
  ],
}

export const JNTriggerNames = {
  [JobNotificationTriggers.REGEX_MESSAGE_MATCH]: "Regex Message Match",
  [JobNotificationTriggers.DURATION_DELTA]: "Duration Delta",
  [JobNotificationTriggers.DURATION_THRESHOLD]: "Duration Threshold",
}

export interface JobEventHandlerConfig {
  config_id?: string
  notification_type: JobNotificationTypes[]
  trigger: JobNotificationTriggers
  notification_service_id: number
  regex?: string
  durationThreshold?: number
}
