import axios from "@/lib/httpUtils"
import type { DateRange } from "react-day-picker"
import { downloadFile } from "@/utils/serviceUtils"
import { jobLog } from "@/models/cacheFiles"
//import socketManager from '../utils/socketManager';

const jobsService = {
  getAllJobs(
    status: string | Array<string> | null,
    sorting: any,
  ): Promise<any> {
    return axios.get("/jobs/allJobs", {
      params: {
        status: status ?? ["STOPPED", "STARTED"],
        sorting,
        limit: 9999999,
      },
    })
  },
  getRunningJobs() {
    return axios.get("/jobs/getRunningJobs")
  },
  executeAction(jobId: string, action: string) {
    return axios.post("/jobs/executeAction", {
      jobId: jobId,
      action: action,
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

  jobLogs(query: string, start: string | number, end: string | number) {
    return axios.get(`/jobs/jobLogs/loki`, {
      params: {
        start: start,
        end: end,
        query: query,
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

  getJobCacheFiles(jobId: string): Promise<any> {
    return axios.get("/files/getCachedFiles", {
      params: {
        jobId: jobId,
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
  getJobOutputFiles(jobId: string): Promise<any> {
    return axios.get("/files/getOutputFiles", {
      params: {
        jobId: jobId,
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
      },
      fetchOptions: {
        fullResponse: true,
      },
    })
  },

  readCacheFile(id: string, fileName: string): Promise<any> {
    return axios.get(`/files/downloadCacheFile`, {
      params: {
        id,
        fileName,
      },
      fetchOptions: {
        fullResponse: true,
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
}

export default jobsService
