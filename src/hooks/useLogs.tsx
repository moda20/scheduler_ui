import type { LogFileMetadata } from "@/models/logs"
import { useCallback, useEffect, useState } from "react"
import {
  downloadLogfile,
  getJobLogs,
  getSystemLogFiles as getSysLogFiles,
  readLogfile as readLogService,
} from "@/services/components/logsService"

export interface useLogsHookProps {
  jobId?: string | number
}

export function useJobLogs({ jobId }: useLogsHookProps) {
  const [logFiles, setLogFiles] = useState<LogFileMetadata[]>([])
  const [systemLogFiles, setSystemLogFiles] = useState<LogFileMetadata[]>([])
  const [loading, setLoading] = useState(false)

  const getJobLogFiles = useCallback(() => {
    return getJobLogs(Number(jobId)).then(d => {
      setLogFiles(d.data)
    })
  }, [jobId])

  const getSystemLogFiles = useCallback(() => {
    return getSysLogFiles().then(d => {
      setSystemLogFiles([...d.sysEvents.data, ...d.scheduleEvents.data])
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    if (jobId) {
      getJobLogFiles().finally(() => {
        setLoading(false)
      })
    } else {
      getSystemLogFiles().finally(() => {
        setLoading(false)
      })
    }
  }, [getJobLogFiles, jobId])

  const readLogFile = useCallback(
    (fileName: string, limit: number = 16000, offset: number = 0): any => {
      return readLogService(
        fileName,
        limit,
        offset,
        jobId ? Number(jobId) : undefined,
      ).then(d => {
        return {
          data: d,
          nextPage:
            offset < d.nextOffset
              ? () => getNextPage(fileName, limit, d.nextOffset)
              : undefined,
        }
      })
    },
    [jobId],
  )

  const getNextPage = useCallback(
    (fileName: string, limit?: number, offset?: number) => {
      return readLogFile(fileName, limit, offset)
    },
    [readLogFile],
  )

  const downloadLogFile = useCallback(
    (fileName: string) => {
      return downloadLogfile(fileName, jobId ? Number(jobId) : undefined)
    },
    [jobId],
  )

  return {
    logFiles,
    loading,
    systemLogFiles,
    readLogFile,
    downloadLogFile,
  }
}
