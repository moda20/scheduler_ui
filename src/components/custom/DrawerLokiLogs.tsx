import { Label } from "@/components/ui/label"
import SheetActionDialog from "@/components/sheet-action-dialog"
import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets"
import type { DateRange } from "react-day-picker"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoaderPinwheelIcon, LogsIcon } from "lucide-react"
import TabCarousel from "@/components/custom/general/TabCarousel"
import Spinner from "@/components/custom/LoadingOverlay"
import { useSocketLogs } from "@/lib/socketUtils"
import { LiveLogViewer } from "@/components/custom/general/LogViewer"
import TabButtonGroup from "@/components/custom/general/TabButtonGroup"
import { useJobLogs } from "@/hooks/useLogs"
import LogFileList from "@/components/custom/general/LogFileList"

export interface DrawerLokiLogsProps {
  start?: Date
  end?: Date
  jobName: string
  trigger?: ReactNode
  jobId?: string
}

const tabList = ["Loki", "Files"]

export default function DrawerLokiLogs(props: DrawerLokiLogsProps) {
  const [watch, setWatch] = useState<CheckedState>(true)
  const [dialogOpen, setDialogOpen] = useState<CheckedState>(false)
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: props.start,
    to: props.end,
  })
  const [activeTab, setActiveTab] = useState<string>("")
  const [activeLogTypeTab, setActiveLogTypeTab] = useState<string>(tabList[0])
  const [loading, setLoading] = useState(false)
  const lokiTabActive = useMemo(
    () => activeLogTypeTab === "Loki",
    [activeLogTypeTab],
  )

  const { logs } = useSocketLogs({
    actions: [],
    format: (stream: any) => {
      stream.values.forEach((log: any) => {
        log.fullMessage = `${log.timestamp} | ${log.type?.toUpperCase()} | ${log.message}`
      })
      return stream
    },
    initialLogsFilter: period,
    logInterval: lokiTabActive && dialogOpen && watch ? 10000 : undefined,
    mergeOutputStreams: false,
    logQuery: `{job="${props.jobName}"}`,
    setEndToMidnight: true,
  })

  const {
    logFiles,
    loading: logFileLoading,
    readLogFile,
    downloadLogFile,
  } = useJobLogs({
    jobId: props.jobId,
  })

  useEffect(() => {
    return () => {
      console.log("logFiles change")
    }
  }, [logFiles])

  const fetchLogs = (open?: boolean) => {
    setDialogOpen(!!open)
  }

  const updatePeriod = (period: DateRange | undefined) => {
    setPeriod(period)
  }

  useEffect(() => {
    if (!activeTab) setActiveTab(logs[0]?.uniqueId)
  }, [logs])

  return (
    <SheetActionDialog
      side={"right"}
      title={`Logs for ${props.jobName}`}
      description={null}
      trigger={props.trigger}
      contentClassName={
        "w-[600px] sm:w-[800px] sm:max-w-[800px] h-full flex flex-col"
      }
      onOpenChange={open => fetchLogs(open)}
      modal={true}
      innerContainerClassName="pb-2"
    >
      <div className={"flex flex-row items-center gap-2 my-2 h-100"}>
        <div className="flex flex-row items-center gap-2 border rounded-md p-2 bg-sidebar">
          <Checkbox
            id={"watchLogs"}
            checked={watch}
            onCheckedChange={setWatch}
            onKeyDown={v => {
              if (v.key === "Escape") {
                v.preventDefault()
              }
            }}
            disabled={!lokiTabActive}
          />
          <Label htmlFor="watchLogs">Watch</Label>
        </div>
        <div>
          <DatePickerWithPresets
            onChange={updatePeriod}
            defaultValue={period}
            disabled={!lokiTabActive}
          />
        </div>
        <div className="flex ml-auto items-center">
          <TabButtonGroup
            tabList={tabList}
            setActiveTab={setActiveLogTypeTab}
            activeTab={activeLogTypeTab}
          />
        </div>
      </div>
      <Spinner
        isLoading={loading || logFileLoading}
        icon={LoaderPinwheelIcon}
        className="h-[calc(100%-3rem)] w-full"
      >
        {lokiTabActive ? (
          <div className="w-full">
            {lokiTabActive && logs.length === 0 && (
              <div className="flex flex-col gap-2 items-center justify-center p-2 border-border border rounded-md w-full">
                <LogsIcon />
                <div className="text-muted-foreground text-sm">
                  No Logs for {props.jobName} found
                </div>
              </div>
            )}
            {logs.length > 0 && (
              <Tabs value={activeTab} className="w-full h-full">
                <TabCarousel>
                  <TabsList className="px-0">
                    {logs.map((stream: any, index) => {
                      return (
                        <TabsTrigger
                          className="data-[state=active]:bg-sidebar"
                          key={stream.uniqueId}
                          value={stream.uniqueId}
                          onClick={() => setActiveTab(stream.uniqueId)}
                          title={stream.uniqueId}
                        >
                          {stream.title}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </TabCarousel>
                {logs.map((stream: any, index) => {
                  return (
                    <TabsContent
                      key={"t" + stream.uniqueId}
                      value={stream.uniqueId}
                      className="h-[inherit]"
                      title={stream.title}
                    >
                      <LiveLogViewer
                        initialLogs={stream.values.map(
                          (e: any) => e.fullMessage,
                        )}
                        wrapLines={false}
                        scrollToLine={1}
                        extraLines={4}
                      />
                    </TabsContent>
                  )
                })}
              </Tabs>
            )}
          </div>
        ) : (
          <LogFileList
            logFiles={logFiles}
            readLogFile={readLogFile}
            originName={props.jobName}
            downloadLogFile={downloadLogFile}
          />
        )}
      </Spinner>
    </SheetActionDialog>
  )
}
