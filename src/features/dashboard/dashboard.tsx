import { AllJobsStats } from "@/components/custom/charts/allJobStats"
import StatsBar from "@/components/custom/dashboard/statsBar"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <StatsBar />
      <AllJobsStats />
    </div>
  )
}
