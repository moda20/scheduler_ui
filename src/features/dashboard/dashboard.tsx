import { AllJobsStats } from "@/components/custom/charts/allJobStats"
import StatsBar from "@/components/custom/dashboard/statsBar"
import { AllEventStats } from "@/components/custom/charts/AllEventStats"
import { JobEventsTable } from "@/components/custom/dashboard/JobEventsTable"
import { defaultLogPeriod } from "@/features/jobsTable/interfaces"
import { useJobs } from "@/hooks/useJobs"
import { useCallback, useMemo, useState } from "react"
import { PaginationState, Updater } from "@tanstack/react-table"
import * as React from "react"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <StatsBar />
      <AllJobsStats />
      <AllEventStats />
    </div>
  )
}
