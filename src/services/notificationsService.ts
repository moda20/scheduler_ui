import axios from "@/lib/httpUtils"
import { JobEventHandlerConfig } from "@/models/jobs"

export const notificationService = {
  getAllNotificationServices(
    offset?: number,
    limit?: number,
    inputIds?: number[],
  ): Promise<any> {
    return axios.get("/notifications/allNotifications", {
      params: {
        limit,
        offset,
        inputIds,
      },
    })
  },
  attachAServiceToJob(jobId: number | number[], serviceId: number) {
    return axios.post(`/notifications/attachServiceToJob`, {
      serviceId,
      jobId,
    })
  },

  addNotificationService(formData: FormData) {
    return axios.post("/notifications/addNotificationService", formData)
  },
  deleteNotificationService(id: number) {
    return axios.delete(`/notifications/deleteNotificationService`, {
      params: {
        id,
      },
    })
  },
  updateNotificationService(formData: FormData) {
    return axios.put(`/notifications/updateNotificationService`, formData)
  },

  getAttachedJobs(serviceId: number) {
    return axios.get(`/notifications/getAttachedJobs`, {
      params: {
        serviceId: serviceId,
      },
    })
  },
  getAllServiceEntryPoints() {
    return axios.get("/notifications/allExternalFiles")
  },
  getNotificationServiceConfigurations(name: string): Promise<any> {
    return axios.get("/notifications/getNotificationServiceConfigurations", {
      params: {
        name,
      },
    })
  },
  updateNotificationServiceConfig(
    name: string,
    config: Record<string, { value: string }>,
  ): Promise<any> {
    return axios.put("/notifications/updateNotificationServiceConfig", {
      name,
      config,
    })
  },
  cloneNotificationService(serviceId: number, name: string) {
    return axios.post("/notifications/cloneNotificationService", {
      serviceId,
      name,
    })
  },
  testNotificationService(id: number) {
    return axios.post("/notifications/testNotificationService", {
      id,
    })
  },
  updateEventHandler(jobId: number, handler: any) {
    return axios.post(`/notifications/updateJobEventHandlers`, {
      handler,
      jobId,
    })
  },
  deleteEventHandler(jobId: number, configId: string) {
    return axios.delete(`/notifications/deleteJobEventHandler`, {
      params: {
        jobId,
        configId,
      },
    })
  },

  getGlobalEventHandlers(): Promise<JobEventHandlerConfig[]> {
    return axios.get("/notifications/globalEventHandlers")
  },
  updateGlobalHandler(handler: any, configId?: string): Promise<any> {
    return axios.put("/notifications/updateGlobalHandlers", {
      handler,
      configId,
    })
  },
  deleteGlobalEventHandler(configId: string): Promise<any> {
    return axios.delete("/notifications/deleteGlobalHandlers", {
      params: {
        configId,
      },
    })
  },
}
