export interface JobsRunningData {
  runningJobsCount: number
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
