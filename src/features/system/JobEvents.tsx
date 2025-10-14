import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { JobEventTypes } from "@/models/jobs"
import { useJobEvents } from "@/hooks/useJobEvents"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets"
import { LiveLogViewer } from "@/components/custom/general/LogViewer"
import type { DateRange } from "react-day-picker"
import { defaultLogPeriod } from "@/features/jobsTable/interfaces"
import { ManagedSimpleDropdown } from "@/components/custom/ManagedSimpleDropdown"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@/utils/generalUtils"
import ScrollableList from "@/components/custom/general/ScrollableList"
import { EventItem } from "@/components/custom/general/EventItem"
import { Cross2Icon } from "@radix-ui/react-icons"
import { JobsListingDropdown } from "@/components/custom/jobsTable/JobsListingDropdown"
import { Button } from "@/components/ui/button"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import { CheckCheckIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const selectEventOptions = Object.values(JobEventTypes).map(e => ({
  label: e.toLocaleLowerCase(),
  value: e,
  selected: true,
}))

export function JobEvents() {
  const query = useQuery()
  const cardContentRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState("")
  const [jobId, setJobId] = useState<string | string[] | undefined>(
    query.get("jobId") ? [query.get("jobId") as string] : undefined,
  )
  const [period, setPeriod] = useState<DateRange>({} as DateRange)
  const [filteredEventTypes, setFilteredEventTypes] = useState([
    JobEventTypes.ERROR,
    JobEventTypes.WARNING,
    JobEventTypes.INFO,
  ])
  const [unreadOnly, setUnreadOnly] = useState(
    query.get("unreadOnly") === "true",
  )

  useEffect(() => {
    setCardHeight(`${(cardContentRef?.current?.clientHeight ?? 0) - 25}px`)
  }, [])

  const {
    events,
    latestEvents,
    loading,
    setEventsToHandled,
    setAllEventsToHandled,
    getNextPage,
    canGetNextPage,
    total,
  } = useJobEvents({
    eventTypes: filteredEventTypes,
    limit: 20,
    offset: 0,
    handled: unreadOnly,
    jobId: jobId ?? undefined,
    format: (data: any) => {
      data.handled = !!data.handled_on
      return data
    },
    period: period,
  })

  const firstSetOfEvents = useMemo(() => {
    return []
  }, [total])
  const nextPageCallback = useCallback(() => {
    return getNextPage().then(() => events)
  }, [events, getNextPage])

  const updateFilterEventTypes = useCallback(
    (events: any) => {
      setFilteredEventTypes(
        events.filter((e: any) => e.selected).map((e: any) => e.value),
      )
    },
    [filteredEventTypes],
  )

  const setEventsToRead = useCallback(
    (items: any | any[]) => {
      return () =>
        setEventsToHandled(
          Array.isArray(items) ? items.map(e => e.id) : [items.id],
        ).then(() => {
          if (Array.isArray(items)) {
            items.forEach(e => {
              e.handled = true
              e.handled_on = new Date().toISOString()
            })
          } else {
            items.handled = true
            items.handled_on = new Date().toISOString()
          }
          toast({
            title: "Event marked as read",
            duration: 2000,
          })
        })
    },
    [filteredEventTypes],
  )

  const setAllEventsToRead = useCallback(
    (action: ConfirmationDialogActionType) => {
      if (action === ConfirmationDialogActionType.CONFIRM) {
        return setAllEventsToHandled().then(() => {
          toast({
            title: "All events marked as read",
            duration: 2000,
          })
        })
      }
    },
    [filteredEventTypes],
  )

  const onPeriodFilterChange = useCallback((period?: DateRange) => {
    setPeriod(period ?? defaultLogPeriod)
  }, [])

  return (
    <div className="flex flex-col  flex-auto gap-4 min-h-0 flex-shrink-2">
      <div className={"flex flex-col gap-1 mb-4"}>
        <h2 className="text-2xl font-bold tracking-tight">Job Event log</h2>
        <p className="text-md font-light">
          All the events triggered by all jobs
        </p>
      </div>
      <Card className="border-border h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 text-foreground bg-background border-border rounded-t-xl">
          <div className="text-l font-bold tracking-tight italic flex-col gap-2 items-left flex-grow-0">
            <div>{total} Events total</div>
            <div className="italic text-sm">All events emitted by all jobs</div>
          </div>

          <div className="flex gap-2 items-center">
            {loading && <Spinner className="!h-5 !w-24" />}

            <ConfirmationDialogAction
              title="Mark all events as handled"
              description={
                "This action is UNDOABLE, all events (shown and not shown) will be marked as handled. if you are looking " +
                "for handling a specific event you can use the button on the right of that event row"
              }
              takeAction={setAllEventsToRead}
              confirmText="Mark All as Read"
              autoFocus={true}
              confirmVariant="destructive"
            >
              <Button variant="outline">
                <CheckCheckIcon className="!h-5 !w-5" /> Mark all as read
              </Button>
            </ConfirmationDialogAction>
            <JobsListingDropdown
              onChange={setJobId}
              selectedItemValue={jobId}
              multiSelect={true}
              comboBoxProps={{
                maxSelectedItemsToShowOnMainTrigger: 1,
              }}
            />
            <ManagedSimpleDropdown
              onChange={updateFilterEventTypes}
              defaultValue={selectEventOptions}
              inputOptions={selectEventOptions}
              multiSelect={true}
              inputPlaceholder={"Filter events"}
              buttonProps={{
                variant: "outline",
              }}
            />
            <DatePickerWithPresets
              onChange={onPeriodFilterChange}
              defaultValue={period}
            />
            <div className="flex gap-2 items-center">
              <Switch checked={unreadOnly} onCheckedChange={setUnreadOnly} />
              <span
                className={cn("text-foreground text-sm transition-colors", {
                  "text-muted-foreground": !unreadOnly,
                })}
              >
                Unread only
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className="p-4 pt-2 h-full flex flex-col"
          ref={cardContentRef}
        >
          <div style={{ maxHeight: cardHeight }} className="overflow-y-auto">
            <ScrollableList
              autoFocus={true}
              originalList={firstSetOfEvents}
              loadMore={canGetNextPage}
              loadMoreAction={nextPageCallback}
              renderNoItems={() => (
                <div className="flex flex-col gap-2 items-center justify-center p-2 border-border border rounded-md">
                  <Cross2Icon />
                  <div className="text-muted-foreground text-sm">
                    No Events found
                  </div>
                </div>
              )}
              renderItem={(item: any, index: number) => {
                return (
                  <EventItem
                    timestamp={item.created_at}
                    message={item.event_message}
                    type={item.type}
                    onHandle={setEventsToRead(item)}
                    handled={item.handled}
                    handleTime={item.handled_on}
                  />
                )
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
