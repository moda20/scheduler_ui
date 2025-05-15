import { useAppSelector } from "@/app/hooks"
import { runningJobs } from "@/app/reducers/jobsReducer"
import { TableOfContentsIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function JobsStatusCount() {
  const runnnigJobsData = useAppSelector(runningJobs)

  return (
    <div
      className={cn(
        "flex gap-2 text-sm items-center p-2 bg-background rounded-lg text-foreground border h-9 border-border",
        runnnigJobsData.runningJobsCount && "bg-success-foreground",
      )}
    >
      <TableOfContentsIcon
        className={cn(runnnigJobsData.runningJobsCount && "text-success")}
      />
      <span className="font-bold">{runnnigJobsData.runningJobsCount}</span>
      <span>jobs running</span>
    </div>
  )
}
