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

export interface DrawerLokiLogsProps {
  start?: Date
  end?: Date
  jobName: string
  trigger?: ReactNode
}

export default function DrawerLokiLogs(props: DrawerLokiLogsProps) {
  const [logs, setLogs] = useState([])
  const [watch, setWatch] = useState<CheckedState>(true)
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: props.start,
    to: props.end,
  })

  useInterval(
    () => {
      getLogs()
    },
    watch ? 10000 : null,
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

  const fetchLogs = (open?: boolean) => {
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
      contentClassName={"w-[600px] sm:w-[800px] sm:max-w-[800px] h-full"}
      onOpenChange={open => fetchLogs(open)}
    >
      <div className={"flex flex-row items-center gap-2 my-2"}>
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
