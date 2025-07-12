import { Clock, FileArchive, LoaderIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { cn } from "@/lib/utils"

export interface JobItemProps {
  job: jobsTableData
  className?: string
}

export default function JobItem({ job, className }: JobItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border border-border rounded-xl p-2",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <span>{job.name}</span>
        <div className="flex gap-2 text-[12px] items-center font-light">
          <FileArchive size="10" className="!h-4 !w-4" />
          {job.consumer}
        </div>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <Badge
          title={job.status === "STARTED" ? "Started" : "Stopped"}
          variant={job.status === "STARTED" ? null : "destructive"}
        >
          <Clock className="!w-4 !h-4" />
        </Badge>
        <Badge
          title={job.isCurrentlyRunning ? "Running" : "Not running"}
          className="w-max"
          variant={job.isCurrentlyRunning ? null : "destructive"}
        >
          <LoaderIcon className="w-4 h-4" />
        </Badge>
      </div>
    </div>
  )
}
