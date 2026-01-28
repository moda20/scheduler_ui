import React, { useCallback, useRef } from "react"
import { useEffect, useState } from "react"
import type { LazyLogProps } from "@melloware/react-logviewer"
import { LazyLog, ScrollFollow } from "@melloware/react-logviewer"
import { colorLog } from "@/utils/generalUtils"

interface LiveLogViewerProps extends LazyLogProps {
  initialLogs: string[]
  height?: number | string
  width?: number | string
  follow?: boolean
  newLogs?: string[]
  coloring?: boolean
  onScrollToBottom?: () => void
  askForLogs?: boolean
}

export const LiveLogViewer: React.FC<LiveLogViewerProps> = ({
  initialLogs,
  height = "100%",
  width = "100%",
  follow = true,
  newLogs,
  coloring,
  onScrollToBottom,
  askForLogs,
  ...lazyProps
}) => {
  const [buffer, setBuffer] = useState<string[]>(() => [...initialLogs])
  const internalRef = useRef<LazyLog>(null)
  const fetchedCountRef = useRef(-1)

  useEffect(() => {
    if (initialLogs.length) {
      setBuffer(prev => colorLog(initialLogs))
    }
  }, [initialLogs])

  useEffect(() => {
    if (newLogs && newLogs.length > 0) {
      setBuffer(prev => {
        return [...prev, ...colorLog(newLogs)]
      })
    }
  }, [newLogs])

  const onReadyForNewLogs = useCallback(
    (onScroll: any) => {
      return async () => {
        if (
          !internalRef.current ||
          !internalRef.current.listRef.current ||
          !onScrollToBottom ||
          !askForLogs
        )
          return onScroll
        const listRef = internalRef.current.listRef.current
        if (
          fetchedCountRef.current < buffer.length &&
          internalRef.current.listRef.current.findItemIndex(
            listRef.scrollOffset + listRef.viewportSize,
          ) +
            50 >
            buffer.length
        ) {
          fetchedCountRef.current = buffer.length
          onScrollToBottom()
        }
        return onScroll
      }
    },
    [onScrollToBottom, buffer, askForLogs],
  )

  return (
    <div style={{ height, width }}>
      <ScrollFollow
        startFollowing={follow}
        render={({ follow: isFollowing, onScroll }) => {
          return (
            <LazyLog
              ref={internalRef}
              stream={true}
              follow={isFollowing}
              onScroll={onReadyForNewLogs(onScroll)}
              text={buffer.join("\n")}
              enableSearch={true}
              selectableLines={true}
              extraLines={1}
              wrapLines={true}
              {...lazyProps}
            />
          )
        }}
      />
    </div>
  )
}
