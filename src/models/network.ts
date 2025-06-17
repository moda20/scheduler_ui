import type { AxiosRequestConfig } from "axios"

type BaseFetchOptions =
  | Omit<RequestInit, "body" | "headers" | "method" | "signal">
  | Record<string, any>

export type extraOptions = BaseFetchOptions & {
  onlyJSON?: boolean
  fullResponse?: boolean
}

// an axios config that forces the use of custom fetch options, TODO remove this usage when a better solution is found
export interface CustomAxiosConfig extends AxiosRequestConfig {
  fetchOptions?: extraOptions
}

export enum JobNotificationTopics {
  JobStarted = "JobStarted",
  JobFinished = "JobFinished",
  JobFailed = "JobFailed",
  Status = "Status",
  NOOP = "NOOP",
}

export interface JobNotification {
  message: string
}

export interface JobStartedNotification extends JobNotification {
  jobId: string
  jobName: string
  runningJobCount: number
  isSingular: boolean
  averageTime: number
}
