import { Label } from "@/components/ui/label"
import SheetActionDialog from "@/components/sheet-action-dialog"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import jobsService from "@/services/JobsService"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets"
import type { DateRange } from "react-day-picker"
import moment from "moment"
import type { CheckedState } from "@radix-ui/react-checkbox"
import useInterval from "@/hooks/useInterval"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileX2, LogsIcon } from "lucide-react"

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

  useInterval(
    () => {
      getLogs()
    },
    dialogOpen && watch ? 10000 : null,
  )

  const getLogs = () => {
    jobsService
      .jobLogs(
        `{job="${props.jobName}"}`,
        moment(period?.from).unix(),
        moment(period?.to)
          .set("hours", 23)
          .set("minutes", 59)
          .set("seconds", 59)
          .unix(),
      )
      .then(res => {
        const parsedLogs = res.data?.result
          ?.sort(
            (a: any, b: any) =>
              Number(b.values[0]?.[0]) - Number(a.values[0]?.[0]),
          )
          .map((stream: any, si: number) => {
            const logValues = stream?.values?.map((log: any) => {
              const logBits = log?.[1]?.split(" | ")
              return {
                timestamp: logBits[0],
                type: logBits[1],
                message: logBits[2],
              }
            })
            return {
              values: logValues,
              uniqueId: `tab_${stream?.stream?.uniqueId?.toString()}`,
              name: stream?.stream?.job,
              title: si
                ? moment(logValues[logValues.length - 1]?.timestamp).format(
                    "YYYY-MM-DD",
                  )
                : `latest (${moment(logValues[logValues.length - 1]?.timestamp).fromNow()})`,
            }
          })
        setLogs(parsedLogs ?? [])
        if (!activeTab) setActiveTab(parsedLogs[0]?.uniqueId)
      })
  }

  const fetchLogs = (open?: boolean) => {
    setDialogOpen(!!open)
    if (open) {
      getLogs()
    }
  }

  const updatePeriod = (period: DateRange | undefined) => {
    setPeriod(period)
    getLogs()
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
      {logs.length > 0 && (
        <Tabs value={activeTab} className="h-[calc(100%-3rem)]">
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
                    className={"rounded-md h-full p-1 overflow-clip bg-sidebar"}
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
    </SheetActionDialog>
  )
}
