import { store } from "@/app/store"
import {
  defaultSocketHookProps,
  JobStartedNotification,
  MiscNotificationTopics,
  useSocketHookProps,
} from "@/models/network"
import { JobNotificationTopics } from "@/models/network"
import {
  setJobRunningStatus,
  setRunningJobsCount,
} from "@/app/reducers/jobsReducer"
import { useCallback, useEffect, useState } from "react"
import { getLokiLogs } from "@/services/components/logsService"

export default class SocketManager {
  socket?: WebSocket
  targetUrl?: string
  static instance: SocketManager
  static stateHandlers: (() => void)[] = []

  constructor(targetUrl?: string) {
    if (!SocketManager.instance) {
      SocketManager.instance = this
    }
    if (targetUrl) {
      this.targetUrl = targetUrl
    }
  }

  static whenCreated = (handler: () => void) => {
    this.stateHandlers.push(handler)
  }

  pingState() {
    SocketManager.stateHandlers.forEach(e => {
      e()
    })
    SocketManager.stateHandlers = []
  }

  createSocket() {
    const targetUrl = store.getState().ui.config.targetServer
    this.socket = new WebSocket(new URL("/ws", targetUrl).toString())
    this.socket.onerror = error => {
      console.log("socket error", error)
    }
    this.socket.onopen = (data: Event) => {
      console.log("socket initiated")
      this.pingState()
    }

    this.setUpEvents()
  }

  setUpEvents() {
    if (!this.socket) {
      console.log("socket not created, not setting up event")
      return
    }
    this.socket!.onmessage = (data: MessageEvent<string>) => {
      const parsedData: {
        id: string
        data: string
      } = JSON.parse(data.data)
      this.actionEvent(parsedData.id, JSON.parse(parsedData?.data || "{}"))
    }
  }

  actionEvent(action: string, data: JobStartedNotification) {
    switch (action) {
      case JobNotificationTopics.NOOP: {
        console.log("socket connection established")
        this.socket!.send(
          JSON.stringify({
            id: JobNotificationTopics.Status,
          }),
        )
        break
      }
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
      case JobNotificationTopics.Status: {
        store.dispatch(setRunningJobsCount(data.runningJobCount))
        break
      }
    }
  }
}

export function useSocketLogs({
  actions,
  format,
  initialLogsFilter,
}: useSocketHookProps = defaultSocketHookProps) {
  const socketInstance = SocketManager.instance
  const [handler, setHandler] = useState<any>()
  const [wsReady, setWsReady] = useState(false)
  const [logs, setLogs] = useState<
    { id: string; logs: any; [key: string]: any }[]
  >([])
  const [latestLogs, setLatestLogs] = useState<
    { id: string; logs: any; [key: string]: any }[]
  >([])
  SocketManager.whenCreated(() => setWsReady(true))
  const ListenerFn = useCallback(
    (handler: (action: string, data: any) => void) =>
      (data: MessageEvent<string>) => {
        if (!data?.data) return
        const parsedData: {
          id: string
          data: string
        } = JSON.parse(data.data)
        if (actions.includes(parsedData.id)) {
          handler(parsedData.id, JSON.parse(parsedData?.data || "{}"))
        }
      },
    [actions],
  )

  const subscribeToEvents = useCallback(
    (handler: (action: string, data: any) => void) => {
      let handlerFn = ListenerFn(handler)
      setHandler(handlerFn)
      socketInstance?.socket?.addEventListener("message", handlerFn)
      socketInstance?.socket?.send(
        JSON.stringify({
          id: JobNotificationTopics.SubscribeToTopic,
          message: JSON.stringify(actions),
        }),
      )
    },
    [wsReady, ListenerFn],
  )

  const unsubscribeFromEvents = useCallback(() => {
    socketInstance?.socket?.removeEventListener("message", handler)
    setHandler(null)
    socketInstance?.socket?.send(
      JSON.stringify({
        id: JobNotificationTopics.UnsubscribeFromTopic,
        message: JSON.stringify(actions),
      }),
    )
  }, [wsReady, handler])

  const getLogs = useCallback(() => {
    return getLokiLogs(
      `{eventName=~".+"}`,
      initialLogsFilter?.from,
      initialLogsFilter?.to,
      {
        setEndToMidnight: true,
        mergeOutputStreams: true,
      },
    ).then(rawLogs => {
      const parsedLogs = rawLogs.map((logArray: any[]) => {
        return {
          id: logArray[2]?.eventName,
          logs: {
            ...logArray[2],
          },
          fullMessage: logArray[1],
        }
      })
      setLogs(parsedLogs)
      return
    })
  }, [initialLogsFilter])

  useEffect(() => {
    if (actions.length) {
      const getLogs = (action: string, data: any) => {
        setLatestLogs([format({ id: action, logs: data })])
      }
      subscribeToEvents(getLogs)
    }
    return () => {
      unsubscribeFromEvents()
    }
  }, [wsReady])

  useEffect(() => {
    if (initialLogsFilter) {
      getLogs()
    }
  }, [initialLogsFilter])

  return { subscribeToEvents, unsubscribeFromEvents, logs, latestLogs }
}

export const socketInstance = SocketManager.instance
