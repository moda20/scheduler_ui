import jobsService from "@/services/JobsService"
import moment from "moment/moment"
import axios from "@/lib/httpUtils"
import { downloadFile } from "@/utils/serviceUtils"

export const getLokiLogs = (
  query: string,
  start?: Date,
  end?: Date,
  options?: { setEndToMidnight?: boolean; mergeOutputStreams?: boolean },
) => {
  const endMomentDate = options?.setEndToMidnight
    ? moment(end).set("hours", 23).set("minutes", 59).set("seconds", 59)
    : moment(end)
  return jobsService
    .jobLogs(
      query,
      moment(start).unix(),
      endMomentDate.unix(),
      options?.mergeOutputStreams,
    )
    .then(res => {
      if (options?.mergeOutputStreams) {
        return res
      }
      return res.data?.result
        ?.sort(
          (a: any, b: any) =>
            Number(b.values[0]?.[0]) - Number(a.values[0]?.[0]),
        )
        .map((stream: any, si: number) => {
          const logValues = stream?.values?.map((log: any) => {
            const logBits = log?.[1]?.split(" | ")
            return {
              timestamp: logBits[0],
              type: logBits[1],
              message: logBits[2],
            }
          })
          return {
            values: logValues,
            uniqueId: `tab_${stream?.stream?.logId?.toString()}`,
            name: stream?.stream?.job,
            title: si
              ? moment(logValues[logValues.length - 1]?.timestamp).format(
                  "YYYY-MM-DD",
                )
              : `latest (${moment(logValues[logValues.length - 1]?.timestamp).fromNow()})`,
          }
        })
    })
}

export const getJobLogs = (jobId: number) => {
  return axios.get("/files/logs/jobLogFiles", {
    params: {
      jobId,
    },
  })
}

export const getSystemLogFiles = (): Promise<any> => {
  return axios.get("/files/logs/systemLogfiles")
}
export const readLogfile = (
  fileName: string,
  limit: number,
  offset: number,
  jobId?: number,
): Promise<{ data: any; nextOffset: number }> => {
  return axios.get("/files/logs/readLogFile", {
    params: {
      filePath: fileName,
      limit,
      offset,
      jobId,
    },
  })
}

export const downloadLogfile = (
  fileName: string,
  jobId?: number,
): Promise<any> => {
  return axios
    .get("/files/logs/downloadLogFile", {
      params: {
        filePath: fileName,
        jobId,
      },
      responseType: "arraybuffer",
      fetchOptions: {
        fullResponse: true,
        onlyJSON: false,
      },
    })
    .then(downloadFile)
}
