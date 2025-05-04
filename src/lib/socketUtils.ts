import { store } from "@/app/store"
import type { JobStartedNotification } from "@/models/network"
import { JobNotificationTopics } from "@/models/network"
import {
  setJobRunningStatus,
  setRunningJobsCount,
} from "@/app/reducers/jobsReducer"

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
    this.socket = new WebSocket(new URL("/ws", targetUrl).toString())
    this.socket.onerror = error => {
      console.log("socket error", error)
    }
    this.socket.onopen = (data: Event) => {
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
      this.actionEvent(parsedData.id, JSON.parse(parsedData.data))
    }
  }

  actionEvent(action: string, data: JobStartedNotification) {
    switch (action) {
      case JobNotificationTopics.JobStarted: {
        store.dispatch(setRunningJobsCount(data.runningJobCount))
        store.dispatch(
          setJobRunningStatus({
            jobId: data.jobId,
            isRunning: true,
          }),
        )
        break
      }
      case JobNotificationTopics.JobFinished: {
        store.dispatch(setRunningJobsCount(data.runningJobCount))
        store.dispatch(
          setJobRunningStatus({
            jobId: data.jobId,
            isRunning: false,
          }),
        )
        break
      }
    }
  }
}

export const socketInstance = SocketManager.instance
