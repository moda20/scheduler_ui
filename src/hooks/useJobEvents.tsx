import type { JobEventTypes } from "@/models/jobs"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  getEvents,
  handleAllEvents,
  handleEvents,
} from "@/services/components/eventsService"
import { JobNotificationTopics } from "@/models/network"
import SocketManager from "@/lib/socketUtils"
import type { DateRange } from "react-day-picker"

export interface useJobEventsProps {
  jobId?: string | string[]
  eventTypes: JobEventTypes[]
  enableEventViaREST?: boolean
  limit?: number
  offset?: number
  jobLogId?: string
  handled?: boolean
  format?: (data: any) => any
  period?: DateRange
}

export function useJobEvents({
  eventTypes,
  jobId,
  offset,
  limit,
  jobLogId,
  handled,
  format = d => d,
  period,
  enableEventViaREST = true,
}: useJobEventsProps) {
  const socketInstance = SocketManager.instance
  const [total, setTotal] = useState(0)
  const [loffset, setOffset] = useState(offset)
  const [llimit, setLimit] = useState(limit)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [handler, setHandler] = useState<any>()
  const [wsReady, setWsReady] = useState(false)
  const [latestEvents, setLatestEvents] = useState<any[]>([])
  const parsedEvents = useMemo(
    () => eventTypes.map(type => `JOB_EVENT_${jobId}_${type}`),
    [eventTypes, jobId],
  )
  SocketManager.whenCreated(() => setWsReady(true))

  const canGetNextPage = useMemo(
    () => (loffset ?? 0) < total,
    [loffset, total, events, handled, events],
  )

  const ListenerFn = useCallback(
    (handler: (event: string, data: any) => void) =>
      (data: MessageEvent<string>) => {
        if (!data?.data) return
        const parsedData: {
          id: string
          data: string
        } = JSON.parse(data.data)
        if (eventTypes.map(String).includes(parsedData.id)) {
          handler(parsedData.id, JSON.parse(parsedData?.data || "{}"))
        }
      },
    [eventTypes],
  )

  const subscribeToEvents = useCallback(
    (handler: (action: string, data: any) => void) => {
      let handlerFn = ListenerFn(handler)
      setHandler(handlerFn)
      socketInstance?.socket?.addEventListener("message", handlerFn)
      socketInstance?.socket?.send(
        JSON.stringify({
          id: JobNotificationTopics.SubscribeToTopic,
          message: JSON.stringify(parsedEvents),
        }),
      )
    },
    [wsReady, ListenerFn],
  )

  const unsubscribeFromEvents = useCallback(() => {
    socketInstance?.socket?.removeEventListener("message", handler)
    setHandler(null)
    if (parsedEvents.length) {
      socketInstance?.socket?.send(
        JSON.stringify({
          id: JobNotificationTopics.UnsubscribeFromTopic,
          message: JSON.stringify(parsedEvents),
        }),
      )
    }
  }, [wsReady, handler])
  const readEvents = useCallback(
    (ioffset?: number, ilimit?: number) => {
      setLoading(true)
      return getEvents({
        jobId,
        eventTypes,
        offset: ioffset ?? loffset,
        limit: ilimit ?? llimit,
        jobLogId,
        unhandled: handled,
        period,
      })
        .then(({ data, total }: any) => {
          const formattedEvents = data
            .map((e: any) => {
              e.handled = !!e.handled_on
              e.job_id = e.job_log_id.split("-")[0]
              return e
            })
            .map(format)
          setEvents(formattedEvents)
          setTotal(total)
          return formattedEvents
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [eventTypes, jobId, offset, limit, jobLogId, handled, period],
  )

  const getNextPage = useCallback(() => {
    if (loffset !== undefined && llimit !== undefined) {
      setOffset(loffset + llimit)
    }
    return readEvents((loffset ?? 0) + (llimit ?? 0), llimit)
  }, [llimit, loffset, readEvents])

  const setEventsToHandled = useCallback(
    (eventIds?: string[]) => {
      setLoading(true)
      setEvents(prevState => {
        eventIds?.forEach(id => {
          const target = prevState.find(e => e.id === Number(id))
          if (target) {
            target.handled = true
          }
        })
        return prevState
      })
      setLatestEvents(prevState => {
        eventIds?.forEach(id => {
          const target = prevState.find(e => e.id === Number(id))
          if (target) {
            target.handled = true
          }
        })
        return prevState
      })
      return handleEvents(eventIds).finally(() => {
        setLoading(false)
        // TODO: check if it's necessary to ask for status via the socket again after reading events
      })
    },
    [events, latestEvents],
  )
  const setAllEventsToHandled = useCallback(
    (jobId?: string) => {
      setLoading(true)
      setEvents(prevState => {
        prevState?.forEach(target => {
          target.handled = true
        })
        return prevState
      })
      setLatestEvents(prevState => {
        prevState?.forEach(target => {
          target.handled = true
        })
        return prevState
      })
      return handleAllEvents(jobId)
        .then(() => readEvents())
        .finally(() => {
          socketInstance.socket!.send(
            JSON.stringify({
              id: JobNotificationTopics.Status,
            }),
          )
          setLoading(false)
          // TODO: check if it's necessary to ask for status via the socket again after reading events
        })
    },
    [events, latestEvents],
  )

  useEffect(() => {
    // resetting the offset & limit on input changes
    setOffset(offset)
    setLimit(limit)
    if (enableEventViaREST) {
      readEvents(offset, limit)
    }
  }, [
    eventTypes,
    jobId,
    offset,
    limit,
    jobLogId,
    handled,
    period,
    enableEventViaREST,
  ])

  useEffect(() => {
    if (eventTypes.length) {
      const getEvents = (event: string, data: any) => {
        setLatestEvents([format({ id: event, events: data })])
        setTotal(prevState => prevState + 1)
      }
      subscribeToEvents(getEvents)
    }
    return () => {
      unsubscribeFromEvents()
    }
  }, [wsReady, eventTypes])

  return {
    events,
    latestEvents,
    loading,
    setEventsToHandled,
    setAllEventsToHandled,
    getNextPage,
    canGetNextPage,
    total,
  }
}
