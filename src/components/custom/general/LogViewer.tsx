import type React from "react"
import { useEffect, useState } from "react"
import { LazyLog, ScrollFollow } from "@melloware/react-logviewer"

interface LiveLogViewerProps {
  initialLogs: string[]
  height?: number | string
  width?: number | string
  follow?: boolean
  newLogs?: string[]
}

export const LiveLogViewer: React.FC<LiveLogViewerProps> = ({
  initialLogs,
  height = "100%",
  width = "100%",
  follow = true,
  newLogs,
  ...lazyProps
}) => {
  const [buffer, setBuffer] = useState<string[]>(() => [...initialLogs])

  useEffect(() => {
    if (initialLogs.length) {
      setBuffer(prev => [...initialLogs, ...(prev ?? [])])
    }
  }, [initialLogs])

  useEffect(() => {
    if (newLogs && newLogs.length > 0) {
      setBuffer(prev => {
        return [...prev, ...newLogs]
      })
    }
  }, [newLogs])

  return (
    <div style={{ height, width }}>
      <ScrollFollow
        startFollowing={follow}
        render={({ follow: isFollowing, onScroll }) => {
          return (
            <LazyLog
              stream={true}
              follow={isFollowing}
              onScroll={onScroll}
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
