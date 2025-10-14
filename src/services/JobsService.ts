import axios from "@/lib/httpUtils"
import type { DateRange } from "react-day-picker"
import { downloadFile } from "@/utils/serviceUtils"
import type { JobRunsQuerySchema } from "@/models/jobs"
import { jobFilteringSchemaType } from "@/components/custom/jobsTable/advancedJobFilteringDialog"

const jobsService = {
  getAllJobs(
    sorting: any,
    status?: string | Array<string>,
    limit?: number,
    offset?: number,
  ): Promise<any> {
    return axios.get("/jobs/allJobs", {
      params: {
        status: status ?? ["STOPPED", "STARTED"],
        sorting,
        limit,
        offset,
      },
    })
  },
  filterJobs(
    status: string | Array<string> | null,
    sorting: any,
    advancedFilters?: any,
  ): Promise<any> {
    return axios.post("/jobs/filterJobs", {
      ...advancedFilters,
      sorting,
    })
  },
  queueJobExecution(execConfig: any) {
    return axios.post("/jobs/queueJobs", execConfig)
  },
  getRunningJobs() {
    return axios.get("/jobs/getRunningJobs")
  },
  executeAction(
    jobId: string,
    action: string,
    batchProcessIds?: Array<number>,
  ) {
    return axios.post("/jobs/executeAction", {
      jobId: jobId,
      action: action,
      jobIdList: batchProcessIds,
    })
  },
  executeActionWithUpdate(action: string, config: any, jobId?: string | null) {
    return axios.post("/jobs/executeAction", {
      jobId: jobId,
      action: action,
      config: config,
    })
  },
  getAvailableConsumers() {
    return axios.get("/jobs/getAvailableConsumers") as Promise<Array<any>>
  },

  isJobRunning(jobId: string) {
    return axios.get("/jobs/isJobRunning", {
      params: {
        jobId: jobId,
      },
    })
  },

  jobLogs(
    query: string,
    start: string | number,
    end: string | number,
    mergeStreams?: boolean,
  ) {
    return axios.get(`/jobs/jobLogs/loki`, {
      params: {
        start: start,
        end: end,
        query: query,
        mergeStreams,
      },
    })
  },

  jobStats(jobIds?: Array<string>, dateRange?: DateRange): Promise<any> {
    return axios.get(`/jobs/getJobStats`, {
      params: {
        jobIds,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
      },
    })
  },

  jobMetrics(): Promise<any> {
    return axios.get(`/jobs/jobMetrics`, {})
  },

  getJobCacheFiles(
    jobId: string,
    offset?: number,
    limit?: number,
  ): Promise<any> {
    return axios.get("/files/getCachedFiles", {
      params: {
        jobId: jobId,
        offset,
        limit,
      },
    })
  },
  downloadCacheFile(id: string, fileName: string): Promise<any> {
    return axios
      .get(`/files/downloadCacheFile`, {
        params: {
          id,
          fileName,
        },
        responseType: "arraybuffer",
        fetchOptions: {
          fullResponse: true,
          onlyJSON: false,
        },
      })
      .then(downloadFile)
  },
  deleteCacheFile(id: string, fileName: string): Promise<any> {
    return axios.delete(`/files/deleteCacheFile`, {
      params: {
        id,
        fileName,
      },
    })
  },
  getJobOutputFiles(
    jobId: string,
    offset?: number,
    limit?: number,
  ): Promise<any> {
    return axios.get("/files/getOutputFiles", {
      params: {
        jobId: jobId,
        offset,
        limit,
      },
    })
  },
  downloadOutputFile(id: string, fileName: string): Promise<any> {
    return axios
      .get(`/files/downloadOutputFile`, {
        params: {
          id,
          fileName,
        },
        responseType: "arraybuffer",
        fetchOptions: {
          fullResponse: true,
          onlyJSON: false,
        },
      })
      .then(downloadFile)
  },
  deleteOutputFile(id: string, fileName: string): Promise<any> {
    return axios.delete(`/files/deleteOutputFile`, {
      params: {
        id,
        fileName,
      },
    })
  },

  readOutputFile(id: string, fileName: string): Promise<any> {
    return axios.get(`/files/downloadOutputFile`, {
      params: {
        id,
        fileName,
        nativeType: true,
      },
      fetchOptions: {
        fullResponse: true,
        onlyJSON: false,
      },
    })
  },

  readCacheFile(id: string, fileName: string): Promise<any> {
    return axios.get(`/files/downloadCacheFile`, {
      params: {
        id,
        fileName,
        nativeType: true,
      },
      fetchOptions: {
        fullResponse: true,
        onlyJSON: false,
      },
    })
  },

  searchJobs(search: string, limit: number, offset: number): Promise<any> {
    return axios.get(`/jobs/allJobs`, {
      params: {
        name: search,
        limit: limit,
        offset: offset,
      },
    })
  },
  getJobRuns(query: JobRunsQuerySchema): Promise<any> {
    return axios.get("/jobs/getJobRuns", {
      params: query,
    })
  },
  exportJobsToJSON(avFilters?: any, jobIds?: number[]): Promise<any> {
    return axios
      .post(
        "/jobs/exportJobsToJSON",
        {
          jobIds: jobIds,
          advancedFilters: avFilters,
        },
        {
          responseType: "arraybuffer",
          fetchOptions: {
            fullResponse: true,
            onlyJSON: false,
          },
        },
      )
      .then(downloadFile)
  },
  importJobsFromJSON(jobList: any[]) {
    return axios.post("/jobs/importJobsFromJSON", jobList)
  },
}

export default jobsService
