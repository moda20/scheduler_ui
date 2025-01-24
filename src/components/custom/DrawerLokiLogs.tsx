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

export interface DrawerLokiLogsProps {
  start?: Date
  end?: Date
  jobName: string
  trigger?: ReactNode
}

export default function DrawerLokiLogs(props: DrawerLokiLogsProps) {
  const [keydownEventSet, setKeydownEventSet] = useState(false)
  const [logWatcher, setLogWatcher] = useState<ReturnType<
    typeof setInterval
  > | null>(null)
  const [logs, setLogs] = useState([])
  const [watch, setWatch] = useState<CheckedState>(true)
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: props.start,
    to: props.end,
  })

  const getlogs = () => {
    jobsService
      .jobLogs(
        `{job="${props.jobName}"}`,
        moment(period?.from).unix(),
        moment(period?.to).unix(),
      )
      .then(res => {
        const parsedLogs = res.data?.result?.[0]?.values?.map((log: any) => {
          const logBits = log?.[1]?.split(" | ")
          return {
            timestamp: logBits[0],
            type: logBits[1],
            message: logBits[2],
          }
        })
        setLogs(parsedLogs ?? [])
      })
  }

  const toggleWatcher = () => {
    if (!logWatcher) {
      const watcherInterval = setInterval(() => {
        getlogs()
      }, 10000)
      setLogWatcher(watcherInterval)
      setWatch(true)
    } else {
      clearInterval(logWatcher)
      setLogWatcher(null)
      setWatch(false)
    }
  }

  const fetchLogs = (open?: boolean) => {
    console.log("fetching logs", open)
    if (open) {
      getlogs()
    }
    toggleWatcher()
  }

  const updatePeriod = (period: DateRange | undefined) => {
    setPeriod(period)
    getlogs()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "p") {
        event.preventDefault()
        if (sideBarTriggerRef?.current) {
          sideBarTriggerRef.current.click()
        }
      }
    }
    if (!keydownEventSet) {
      window.addEventListener("keydown", handleKeyDown)
      setKeydownEventSet(true)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      setKeydownEventSet(false)
      logWatcher && clearInterval(logWatcher)
    }
  }, [])

  const initialSideBarRef: any = null
  const sideBarTriggerRef = useRef(initialSideBarRef)

  return (
    <SheetActionDialog
      side={"right"}
      title={`Logs for ${props.jobName}`}
      description={null}
      trigger={props.trigger}
      contentClassName={"w-[600px] sm:w-[800px] sm:max-w-[800px] h-full"}
      onOpenChange={open => fetchLogs(open)}
    >
      <div className={"flex flex-row items-center gap-2 my-2"}>
        <div className="flex flex-row items-center gap-2 border rounded-md p-2 bg-sidebar">
          <Checkbox
            id={"watchLogs"}
            checked={watch}
            onCheckedChange={toggleWatcher}
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
      <ScrollArea className="h-full">
        <div className={"rounded-md h-full p-1  overflow-clip bg-sidebar"}>
          {logs.map((log: any, index) => {
            return (
              <div
                key={index}
                className={"flex flex-row items-center gap-2 mb-2"}
              >
                <Label className="min-w-[190px]">{log.timestamp}</Label>
                <Badge variant={"defaultTeal"}>{log.type}</Badge>
                <Label className="leading-5">{log.message}</Label>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </SheetActionDialog>
  )
}
