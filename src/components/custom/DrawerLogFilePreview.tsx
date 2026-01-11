import SheetActionDialog from "@/components/sheet-action-dialog"
import type { ReactNode } from "react"
import { useCallback, useState } from "react"
import { LiveLogViewer } from "@/components/custom/general/LogViewer"
import type { LogsStructure } from "@/models/logs"

export interface DrawerLogFilePreviewProps {
  trigger: ReactNode
  id: string
  fileName: string
  titleName?: string
  originName?: string
  readLogs?: (fileName: string) => Promise<LogsStructure>
}

export default function DrawerLogFilePreview({
  trigger,
  id,
  fileName,
  titleName,
  originName,
  readLogs,
}: DrawerLogFilePreviewProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [lineCount, setLineCount] = useState(0)
  const [logStructure, setLogStructure] = useState<LogsStructure>({
    data: {
      lines: [],
      nextOffset: 0,
    },
    nextPage: undefined,
  })

  const resetLogStructure = useCallback(() => {
    setLogStructure({
      data: {
        lines: [],
        nextOffset: 0,
      },
      nextPage: undefined,
    })
    setLineCount(0)
  }, [])

  const getFileContent = useCallback(() => {
    setIsFetching(true)
    return (
      logStructure.nextPage ? logStructure.nextPage() : readLogs?.(fileName)
    )
      ?.then(data => {
        console.log("data", data)
        setLogStructure(data)
        setLineCount(lineCount + data.data.lines.length)
      })
      .finally(() => {
        setIsFetching(false)
      })
  }, [fileName, lineCount, logStructure, readLogs])

  return (
    <SheetActionDialog
      side={"right"}
      title={
        <span>
          <span>Previewing</span> <i className={"text-gray-400"}>{titleName}</i>
        </span>
      }
      description={
        <span>
          Origin : <i>{originName}</i>
        </span>
      }
      contentClassName="w-[600px] sm:w-[800px] sm:max-w-[800px] h-full flex flex-col"
      innerContainerClassName={"pb-0"}
      trigger={trigger}
      onOpenChange={v => {
        if (v) {
          getFileContent()
        } else {
          resetLogStructure()
        }
      }}
    >
      <LiveLogViewer
        initialLogs={[]}
        newLogs={logStructure.data.lines}
        wrapLines={false}
        scrollToLine={1}
        extraLines={1}
        loading={isFetching}
        onScrollToBottom={getFileContent}
        askForLogs={!!logStructure.nextPage}
        follow={false}
      />
    </SheetActionDialog>
  )
}
