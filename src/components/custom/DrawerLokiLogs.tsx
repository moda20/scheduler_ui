import { Label } from "@/components/ui/label"
import SheetActionDialog from "@/components/sheet-action-dialog"
import type { ReactNode } from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets"
import type { DateRange } from "react-day-picker"
import type { CheckedState } from "@radix-ui/react-checkbox"
import useInterval from "@/hooks/useInterval"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoaderPinwheelIcon, LogsIcon } from "lucide-react"
import { getLokiLogs } from "@/services/components/logsService"
import TabCarousel from "@/components/custom/general/TabCarousel"
import Spinner from "@/components/ui/spinner"

export interface DrawerLokiLogsProps {
  start?: Date
  end?: Date
  jobName: string
  trigger?: ReactNode
}

export default function DrawerLokiLogs(props: DrawerLokiLogsProps) {
  const [logs, setLogs] = useState([])
  const [watch, setWatch] = useState<CheckedState>(true)
  const [dialogOpen, setDialogOpen] = useState<CheckedState>(false)
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: props.start,
    to: props.end,
  })
  const [activeTab, setActiveTab] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useInterval(
    () => {
      getLogs()
    },
    dialogOpen && watch ? 10000 : null,
  )

  const getLogs = () => {
    return getLokiLogs(`{job="${props.jobName}"}`, period?.from, period?.to, {
      setEndToMidnight: true,
    }).then(parsedLogs => {
      setLogs(parsedLogs ?? [])
      if (!activeTab) setActiveTab(parsedLogs[0]?.uniqueId)
      return
    })
  }

  const fetchLogs = (open?: boolean) => {
    setDialogOpen(!!open)
    if (open) {
      setLoading(true)
      getLogs().then(() => {
        setLoading(false)
      })
    }
  }

  const updatePeriod = (period: DateRange | undefined) => {
    setPeriod(period)
    setLoading(true)
    getLogs().then(() => {
      setLoading(false)
    })
  }

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
          />
          <Label htmlFor="watchLogs">Watch</Label>
        </div>
        <div>
          <DatePickerWithPresets
            onChange={updatePeriod}
            defaultValue={period}
          />
        </div>
      </div>
      {logs.length === 0 && (
        <div className="flex flex-col gap-2 items-center justify-center p-2 border-border border rounded-md">
          <LogsIcon />
          <div className="text-muted-foreground text-sm">
            No Logs for {props.jobName} found
          </div>
        </div>
      )}
      <Spinner
        isLoading={loading}
        icon={LoaderPinwheelIcon}
        className="h-[calc(100%-3rem)] w-full"
      >
        {logs.length > 0 && (
          <Tabs value={activeTab} className="w-full">
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
                  <ScrollArea className="pb-2 flex flex-col gap-0.5 h-full">
                    <div
                      className={
                        "rounded-md h-full p-1 overflow-clip bg-sidebar"
                      }
                    >
                      {stream.values.map((log: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={"flex flex-row items-center gap-2 mb-2"}
                          >
                            <Label className="min-w-[170px] whitespace-nowrap">
                              {log.timestamp}
                            </Label>
                            <Badge variant={"defaultTeal"}>{log.type}</Badge>
                            <Label className="leading-5">{log.message}</Label>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              )
            })}
          </Tabs>
        )}
      </Spinner>
    </SheetActionDialog>
  )
}
