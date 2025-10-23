import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { runningJobs } from "@/app/reducers/jobsReducer"
import { cn } from "@/lib/utils"
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router"
import { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { changeRoute, routes } from "@/app/reducers/uiReducer"

export default function JobEventsCount() {
  const runningJobsData = useAppSelector(runningJobs)
  const routesList = useAppSelector(routes)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const targetJobEventsRoute = useMemo(
    () => routesList?.[1].items?.find(e => e.id === "jobEvents"),
    [routesList],
  )

  const navigateToJobEvens = useCallback(
    (readOnly: any) => () => {
      if (targetJobEventsRoute && routesList) {
        dispatch(changeRoute([routesList?.[1], targetJobEventsRoute]))
      }
      return navigate({
        pathname: "/jobEvents",
        search: `?unreadOnly=${readOnly}`,
      })
    },
    [navigate],
  )
  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={navigateToJobEvens(true)}
        title={`${runningJobsData.jobEvents?.errors} job errors`}
        className={cn(
          "flex gap-2 text-sm items-center p-2 bg-background rounded-lg text-foreground border h-9 border-border",
          "hover:bg-foreground hover:text-background",
          runningJobsData.jobEvents?.errors > 0 && "bg-destructive",
        )}
      >
        <Cross2Icon className={cn("!h-5 !w-5")} />
        <span className={cn("font-bold")}>
          {runningJobsData.jobEvents?.errors ?? 0}
        </span>
      </Button>
      <Button
        onClick={navigateToJobEvens(true)}
        title={`${runningJobsData.jobEvents?.warnings} job warnings`}
        className={cn(
          "flex gap-2 text-sm items-center p-2 bg-background rounded-lg text-foreground border h-9 border-border",
          "hover:bg-foreground hover:text-background",
          runningJobsData.jobEvents?.warnings > 0 && "",
        )}
      >
        <ExclamationTriangleIcon
          className={cn(
            runningJobsData.jobEvents?.warnings > 0 && "text-yellow-500",
            "!h-5 !w-5",
          )}
        />
        <span
          className={cn(
            "font-bold",
            runningJobsData.jobEvents?.warnings > 0 && "text-yellow-500",
          )}
        >
          {runningJobsData.jobEvents?.warnings ?? 0}
        </span>
      </Button>
    </div>
  )
}
