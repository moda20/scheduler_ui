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
