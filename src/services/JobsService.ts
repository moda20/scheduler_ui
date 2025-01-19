import axios, { mongoAxiosService } from "@/lib/httpUtils"
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
      },
    })
  },
  executeAction(jobId: string, action: string) {
    return axios.post("/jobs/executeAction", {
      jobId: jobId,
      action: action,
    })
  },
  executeActionWithUpdate(jobId: string | null, action: string, config: any) {
    return axios.post("/jobs/executeAction", {
      jobId: jobId,
      action: action,
      jobConfig: config,
    })
  },
  getAvailableConsumers() {
    return axios.get("/jobs/availableConsumers") as Promise<Array<any>>
  },

  getAvailableSubCategories(search: string) {
    return axios.get("/items/categories", {
      params: {
        limit: 999999,
        search,
      },
    })
  },

  getAllMadeCategories({
    limit,
    offset,
    search,
  }: {
    limit: number | string
    offset: number | string
    search: any
  }) {
    return mongoAxiosService.get("/category/allMadeCategories", {
      params: {
        limit,
        search,
        offset,
      },
    })
  },

  createCategory(values: any, id: string) {
    return mongoAxiosService.post("/category/createCategory", {
      name: values.name,
      subCategories: values.subCategories.join(","),
      id: id,
    })
  },

  subscribeToLogs(socketId: string, uniqueId: string) {
    return axios.post("/jobs/subscribeToLogs", {
      uniqueId: uniqueId,
    })
  },

  connectToLogWebsocket() {
    //return socketManager.connectToSocket()
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
}

export default jobsService
