import { cn } from "@/lib/utils"
import type { EventItemProps } from "@/models/jobs"
import { eventTypeColors, JobEventTypes } from "@/models/jobs"
import { ButtonWithTooltip } from "@/components/custom/general/ButtonWithTooltip"
import { CheckCheckIcon, CheckSquareIcon } from "lucide-react"
import moment from "moment/moment"
import type { ReactNode } from "react"
import React, { useMemo } from "react"
import { getConsumersCBox, takeAction } from "@/features/jobsTable/jobsUtils"
import { defaultLogPeriod } from "@/features/jobsTable/interfaces"
import ActionDropdown from "@/components/custom/jobsTable/actionDropdown"

const EventItem = ({
  timestamp,
  message,
  type = JobEventTypes.INFO,
  className,
  handled,
  onHandle,
  handleTime,
  job,
  ref,
}: EventItemProps) => {
  const colors = eventTypeColors[type]

  const TargetAction = useMemo(() => {
    return ({ children }: { children: ReactNode }) =>
      job ? (
        <ActionDropdown
          columnsProps={{
            takeAction,
            getAvailableConsumers: getConsumersCBox,
          }}
          row={job}
          defaultLogPeriod={defaultLogPeriod}
          inputGroup="eventCommandActions"
          modal={true}
          dropdownContentProps={{
            align: "end",
          }}
        >
          {children}
        </ActionDropdown>
      ) : (
        <>{children}</>
      )
  }, [job])

  return (
    <TargetAction>
      <div
        className={cn(
          "group relative flex gap-3 border-l-2 pl-3 py-2 transition-colors duration-200",
          colors.border,
          colors.bg,
          className,
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1 font-mono text-sm flex-grow-1">
            <time className="text-muted-foreground text-xs">{timestamp}</time>
            <p className="text-muted-foreground text-xs italic">{job?.name}</p>
            <p className="leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-2 items-center flex-grow-1">
            {handled && (
              <time
                className="text-muted-foreground text-xs"
                title={`Handled on ${handleTime}`}
              >
                {moment(handleTime).fromNow()}
              </time>
            )}
            <ButtonWithTooltip
              variant="ghost"
              size="icon"
              tooltipContent={
                handled ? `Handled on ${handleTime}` : "Set this event to read"
              }
              tooltipContentClassName="text-foreground bg-background border-border border-2"
              onClick={onHandle}
              disabled={handled}
            >
              {handled ? (
                <CheckCheckIcon className="text-success !h-5 !w-5" />
              ) : (
                <CheckSquareIcon />
              )}
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </TargetAction>
  )
}

const exportedEventItem = React.forwardRef<
  React.ElementRef<typeof EventItem>,
  EventItemProps
>((props, ref) => {
  return <EventItem ref={ref} {...props} />
})

export { exportedEventItem as EventItem }
