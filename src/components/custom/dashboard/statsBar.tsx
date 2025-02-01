import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileWarningIcon, FolderKanban } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import jobsService from "@/services/JobsService"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import WithError from "@/components/custom/dashboard/WithError"

export interface StatsBarProps {
  metrics?: any
}

export default function StatsBar(props: StatsBarProps) {
  const [jobMetrics, setJobMetrics] = useState(props.metrics ?? {})
  const [hasError, setHasError] = useState(false)

  const getJobMetrics = async () => {
    jobsService
      .jobMetrics()
      .then(data => {
        setJobMetrics(data)
      })
      .catch(err => {
        setHasError(true)
      })
  }

  useEffect(() => {
    getJobMetrics()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={cn("border-border", hasError && "border-destructive")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 text-foreground bg-background border-border rounded-t-xl">
          <CardTitle className="text-sm font-medium">
            Number of Registered jobs
          </CardTitle>
          {hasError ? (
            <Tooltip>
              <TooltipTrigger>
                <FileWarningIcon className="text-destructive" />
              </TooltipTrigger>
              <TooltipContent className="text-destructive border-destructive">
                Error fetching job metrics
              </TooltipContent>
            </Tooltip>
          ) : (
            <FolderKanban />
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold mb-2">
            <WithError errorCpt={`...`} hasError={hasError}>
              {jobMetrics.job_count}
            </WithError>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-md font-bold">
                <WithError errorCpt={`N/A`} hasError={hasError}>
                  {jobMetrics.running_jobs_count}
                </WithError>
              </span>
              are currently scheduled
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-md font-bold">
                <WithError errorCpt={`N/A`} hasError={hasError}>
                  {jobMetrics.runningJobsCount}
                </WithError>
              </span>
              are currently running
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
