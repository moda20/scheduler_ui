import { store } from "@/app/store"
import type { JobStartedNotification } from "@/models/network"
import { JobNotificationTopics } from "@/models/network"
import { setRunningJobsCount } from "@/app/reducers/jobsReducer"

export default class SocketManager {
  socket: WebSocket | undefined
  targetUrl?: string
  static instance: SocketManager

  constructor(targetUrl?: string) {
    if (!SocketManager.instance) {
      SocketManager.instance = this
    }
    if (targetUrl) {
      this.targetUrl = targetUrl
    }
  }

  createSocket() {
    const targetUrl = store.getState().ui.config.targetServer
    this.socket = new WebSocket(`${targetUrl}/ws`)
    this.socket.onopen = (data: Event) => {
      console.log(data)
      console.log("socket opened")
    }
    this.setUpEvents()
  }

  setUpEvents() {
    this.socket!.onmessage = (data: MessageEvent<string>) => {
      const parsedData: {
        id: string
        data: string
      } = JSON.parse(data.data)
      console.log(parsedData)
      this.actionEvent(parsedData.id, JSON.parse(parsedData.data))
    }
  }

  actionEvent(action: string, data: JobStartedNotification) {
    switch (action) {
      case JobNotificationTopics.JobStarted:
      case JobNotificationTopics.JobFinished: {
        store.dispatch(setRunningJobsCount(data.runningJobCount))
        break
      }
    }
  }
}

export const socketInstance = SocketManager.instance
