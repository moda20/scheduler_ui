import axios from "@/lib/httpUtils"

export const notificationService = {
  getAllNotificationServices(offset?: number, limit?: number) {
    return axios.get("/notifications/allNotifications", {
      params: {
        limit,
        offset,
      },
    })
  },
  attachAServiceToJob(jobId: number | number[], serviceId: number) {
    return axios.post(`/notifications/attachServiceToJob`, {
      serviceId,
      jobId,
    })
  },

  addNotificationService({
    name,
    description,
    entryPoint,
    image,
  }: {
    name: string
    description?: string
    entryPoint: string
    image?: string
  }) {
    return axios.post("/notifications/addNotificationService", {
      name,
      description,
      entryPoint,
      image,
    })
  },
  deleteNotificationService(id: number) {
    return axios.delete(`/notifications/deleteNotificationService`, {
      params: {
        id,
      },
    })
  },
  updateNotificationService({
    id,
    name,
    description,
    entryPoint,
    image,
  }: {
    id: number
    name?: string
    description?: string
    entryPoint?: string
    image?: string
  }) {
    return axios.put(`/notifications/updateNotificationService`, {
      id,
      name,
      description,
      entryPoint,
      image,
    })
  },

  getAttachedJobs(serviceId: number) {
    return axios.get(`/notifications/getAttachedJobs`, {
      params: {
        serviceId: serviceId,
      },
    })
  },
}
