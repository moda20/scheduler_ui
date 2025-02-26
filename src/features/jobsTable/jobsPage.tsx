import jobsService from "@/services/JobsService"
import { DataTable } from "@/features/jobsTable/jobsTable"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { getTableColumns, jobActions } from "@/features/jobsTable/interfaces"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import type { Row, SortingState } from "@tanstack/react-table"
import { toast } from "@/hooks/use-toast"
import { JobUpdateDialog, JobUpdateType } from "@/components/job-update-dialog"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { ComboBoxItem } from "@/components/ui/combo-box"
import { InputIcon } from "@radix-ui/react-icons"
import { IconInput } from "@/components/custom/IconInput"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/app/hooks"
import { config } from "@/app/reducers/uiReducer"

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
        let logsPerJob = data.logs.result.reduce((p: any, c: any) => {
          p[c.job_id] = c
          return p
        }, {})
        let errorPerJob = data.errors.result.reduce((p: any, c: any) => {
          p[c.job_id] = c
          return p
        }, {})

        data?.registeredJobs?.jobs.map((e: any) => {
          if (Object.values(e.isCurrentlyRunning).length > 0) {
            e.hasJobsRunning = true
          }
          e.logs = logsPerJob[e.id]
          e.latestError = errorPerJob[e.job_id]?.error
          e.running = e.hasJobsRunning
          e.lastRun = e.hasJobsRunning
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

  async function getAvailableConsumers(): Promise<ComboBoxItem[]> {
    return jobsService.getAvailableConsumers().then((data: Array<Object>) => {
      return data.map((item: any) => {
        return {
          value: item,
          label: item,
        }
      })
    })
  }

  async function takeAction(
    row: Row<jobsTableData> | null,
    action: jobActions,
    data?: JobUpdateType | any,
  ) {
    setLoading(true)
    switch (action) {
      case jobActions.SCHEDULE:
        await jobsService
          .executeAction(row!.original.id, "START")
          .then(data => {
            toast({
              title: `Service ${row!.original.name} Scheduled`,
              duration: 3000,
            })
            return fetchTableData()
          })
          .finally(() => {
            setLoading(true)
          })
        break
      case jobActions.UNSCHEDULE:
        await jobsService
          .executeAction(row!.original.id, "STOP")
          .then(data => {
            toast({
              title: `Service ${row!.original.name} De-scheduled`,
              duration: 3000,
            })
          })
          .finally(() => {
            setLoading(true)
          })
        break
      case jobActions.EXECUTE:
      case jobActions.EXECUTE_IN_THE_BACKGROUND:
        await jobsService
          .executeAction(row!.original.id, "EXECUTE")
          .then(() => {
            toast({
              title: `Service ${row!.original.name} Launched`,
              duration: 3000,
            })
          })
          .catch(err => {
            toast({
              title: err.message,
              variant: "destructive",
            })
          })
        break
      case jobActions.UPDATE:
        await jobsService
          .executeActionWithUpdate(row!.original.id, "STOP", data)
          .then(d => {
            return jobsService.executeAction(row!.original.id, "START")
          })
          .then(() => {
            toast({
              title: `Service ${row!.original.name} Updated`,
              duration: 3000,
            })
          })
          .finally(() => {
            setLoading(true)
          })
        break
      case jobActions.CREATE:
        await jobsService
          .executeActionWithUpdate(null, "CREATE", {
            ...data,
            status: "STOPPED",
            exclusive: true,
          })
          .then(() => {
            toast({
              title: `Service ${data.name} Created`,
              duration: 3000,
            })
          })
          .finally(() => {
            setLoading(false)
          })
        break

      case jobActions.SOFT_DELETE:
        await jobsService.isJobRunning(row!.original.id).then((data: any) => {
          if (data) {
            toast({
              title: `Service ${row!.original.name} is running and cannot be deleted`,
              variant: "destructive",
            })
          } else {
            return jobsService
              .executeAction(row!.original.id, "SOFT_DELETE")
              .then(() => {
                toast({
                  title: `Service ${row!.original.name} deleted`,
                })
              })
              .catch(err => {
                toast({
                  title: err.message,
                  variant: "destructive",
                })
              })
          }
        })
        break
    }
    setLoading(true)
    await fetchTableData()
  }

  const columns = getTableColumns({ takeAction, getAvailableConsumers })
  const runningJobsCount = Number(
    data?.registeredJobs?.runningJobsCount?.runningJobsCount ?? 0,
  )
  return (
    <div className="">
      <div className={"table-header flex items-center py-4 justify-between"}>
        <JobUpdateDialog
          jobDetails={undefined}
          isCreateDialog={true}
          itemList={getAvailableConsumers}
          onChange={jobData => takeAction(null, jobActions.CREATE, jobData)}
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
