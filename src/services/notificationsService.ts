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
}
