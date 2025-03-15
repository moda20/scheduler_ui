import jobsService from "@/services/JobsService"
import { DataTable } from "@/features/jobsTable/jobsTable"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { getTableColumns, jobActions } from "@/features/jobsTable/interfaces"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import type { Row, SortingState } from "@tanstack/react-table"
import { toast } from "@/hooks/use-toast"
import type { JobUpdateType } from "@/components/job-update-dialog"
import { JobUpdateDialog } from "@/components/job-update-dialog"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/app/hooks"
import { config } from "@/app/reducers/uiReducer"
import { getConsumersCBox, takeAction } from "@/features/jobsTable/jobsUtils"

export const defaultSortingState = [{ id: "cronSetting", desc: true }]

export default function JobsPage() {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [fetchingData, setFetchingStatus] = useState(false)
  const [sorting, setSorting] = useState<SortingState>(defaultSortingState)
  const savedConfig = useAppSelector(config)
  async function fetchTableData(inputSorting?: SortingState) {
    setFetchingStatus(true)
    return await jobsService
      .getAllJobs(null, inputSorting ?? sorting)
      .then(data => {
        data?.registeredJobs?.jobs.map((e: any) => {
          if (Object.values(e.isCurrentlyRunning).length > 0) {
            e.hasJobsRunning = true
          }
          e.running = e.hasJobsRunning
          return e
        })
        return data
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setData([])
        setLoading(false)
      })
      .finally(() => setFetchingStatus(false))
  }
  useEffect(() => {
    if (!fetchingData) {
      setLoading(true)
      fetchTableData()
    }
  }, [savedConfig.targetServer])

  async function filterAndPaginationChange({ sorting }: { sorting: any }) {
    setSorting(sorting)
    setLoading(true)
    await fetchTableData(sorting)
  }

  async function takeJobsAction(
    row: jobsTableData | null,
    action: jobActions,
    data?: JobUpdateType | any,
  ) {
    setLoading(true)
    await takeAction(row, action, data)
    setLoading(true)
    await fetchTableData()
  }

  const columns = getTableColumns({
    takeAction: takeJobsAction,
    getAvailableConsumers: getConsumersCBox,
  })
  const runningJobsCount = Number(
    data?.registeredJobs?.runningJobsCount?.runningJobsCount ?? 0,
  )
  return (
    <div className="">
      <div className={"table-header flex items-center py-4 justify-between"}>
        <JobUpdateDialog
          jobDetails={undefined}
          isCreateDialog={true}
          itemList={getConsumersCBox}
          onChange={jobData => takeJobsAction(null, jobActions.CREATE, jobData)}
        >
          <Button variant="outline" className={"border-border"}>
            <PlusIcon /> New job
          </Button>
        </JobUpdateDialog>
        <div className="">
          <Badge variant={runningJobsCount > 0 ? "outline" : "default"}>
            {runningJobsCount} jobs running
          </Badge>
        </div>
      </div>
      <Spinner show={loading}>
        <DataTable
          columns={columns}
          data={data?.registeredJobs?.jobs ?? []}
          filters={{ sorting }}
          events={{
            onPageChange: filterAndPaginationChange,
            actionConfirmed: fetchTableData,
          }}
        />
      </Spinner>
    </div>
  )
}
