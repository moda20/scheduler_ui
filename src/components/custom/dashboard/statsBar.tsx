import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban } from "lucide-react"
import { useEffect, useState } from "react"
import jobsService from "@/services/JobsService"

export interface StatsBarProps {
  metrics?: any
}

export default function StatsBar(props: StatsBarProps) {
  const [jobMetrics, setJobMetrics] = useState(props.metrics ?? {})

  const getJobMetrics = async () => {
    jobsService.jobMetrics().then(data => {
      setJobMetrics(data[0])
    })
  }

  useEffect(() => {
    getJobMetrics()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 text-foreground bg-background border-border rounded-t-xl">
          <CardTitle className="text-sm font-medium">
            Number of Scheduled jobs
          </CardTitle>
          <FolderKanban />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{jobMetrics.job_count}</div>
          <p className="text-xs text-muted-foreground">
            {jobMetrics.running_jobs_count} are currently running
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
