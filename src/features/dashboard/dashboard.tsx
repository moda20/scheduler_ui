import { AllJobsStats } from "@/components/custom/charts/allJobStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatsBar from "@/components/custom/dashboard/statsBar"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <StatsBar />
      <AllJobsStats />
    </div>
  )
}
