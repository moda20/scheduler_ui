export interface CacheFile {
  id: string
  job_log_id: string
  file_name: string
  file_size: number
  file_type: string
  parsed_file_size?: string | null
}
export interface OutputFile {
  id: string
  job_log_id: string
  file_name: string
  file_size: number
  file_type: string
  parsed_file_size?: string | null
}

export interface jobLog {
  id: string
  job_id: string
  machine: string
  start_time: string
  end_time: string
  result: string | null
  error: string | null
  cacheFiles?: CacheFile[]
  outputFiles?: OutputFile[]
}
