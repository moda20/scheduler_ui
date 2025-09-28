import type React from "react"
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
}

export const LiveLogViewer: React.FC<LiveLogViewerProps> = ({
  initialLogs,
  height = "100%",
  width = "100%",
  follow = true,
  newLogs,
  coloring,
  ...lazyProps
}) => {
  const [buffer, setBuffer] = useState<string[]>(() => [...initialLogs])

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
