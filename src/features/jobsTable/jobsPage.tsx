import jobsService from "@/services/JobsService"
import { DataTable } from "@/features/jobsTable/jobsTable"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { getTableColumns, jobActions } from "@/features/jobsTable/interfaces"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Spinner from "@/components/ui/spinner"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { JobUpdateType } from "@/components/job-update-dialog"
import { JobUpdateDialog } from "@/components/job-update-dialog"
import { Button } from "@/components/ui/button"
import { PlusIcon, LoaderPinwheelIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { config } from "@/app/reducers/uiReducer"
import { getConsumersCBox, takeAction } from "@/features/jobsTable/jobsUtils"
import {
  jobsList,
  setJobsList,
  setRunningJobsCount,
} from "@/app/reducers/jobsReducer"

export const defaultSortingState = [{ id: "cronSetting", desc: true }]

export default function JobsPage() {
  const [loading, setLoading] = useState(true)
  const [fetchingData, setFetchingStatus] = useState(false)
  const [sorting, setSorting] = useState<SortingState>(defaultSortingState)
  const savedConfig = useAppSelector(config)
  const JobsList = useAppSelector(jobsList)
  const dispatch = useAppDispatch()
  async function fetchTableData(inputSorting?: SortingState) {
    setFetchingStatus(true)
    return await jobsService
      .getAllJobs(null, inputSorting ?? sorting)
      .then(data => {
        dispatch(setJobsList(data))
        setLoading(false)
      })
      .catch(err => {
        dispatch(setJobsList([]))
        setLoading(false)
      })
      .finally(() => setFetchingStatus(false))
  }

  const updateTableData = useCallback(
    (sorting?: any) => {
      return Promise.all([getRunningJobs(), fetchTableData(sorting)])
    },
    [sorting],
  )

  async function getRunningJobs() {
    return await jobsService.getRunningJobs().then((data: any) => {
      dispatch(setRunningJobsCount(data.count))
    })
  }
  useEffect(() => {
    if (!fetchingData) {
      setLoading(true)
      updateTableData()
    }
  }, [savedConfig.targetServer])

  const filterAndPaginationChange = useCallback(
    async ({ sorting: newSorting }: { sorting: any }) => {
      const targetSorting =
        newSorting?.length ||
        (sorting === defaultSortingState && !newSorting?.length)
          ? newSorting
          : defaultSortingState
      setSorting(targetSorting)
      setLoading(true)
      await updateTableData(targetSorting)
    },
    [],
  )

  const tableEventsMemoized = useMemo(
    () => ({
      onPageChange: filterAndPaginationChange,
      actionConfirmed: updateTableData,
    }),
    [filterAndPaginationChange, updateTableData],
  )

  const takeJobsAction = useCallback(
    async (
      row: jobsTableData | null,
      action: jobActions,
      data?: JobUpdateType | any,
    ) => {
      setLoading(true)
      await takeAction(row, action, data)
      setLoading(true)
      await updateTableData()
    },
    [sorting],
  )

  const columns: ColumnDef<jobsTableData, any>[] = useMemo(() => {
    return getTableColumns({
      takeAction: takeJobsAction,
      getAvailableConsumers: getConsumersCBox,
    })
  }, [sorting])

  const filterMemo = useMemo(() => {
    return {
      sorting: sorting,
    }
  }, [sorting])

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
      </div>
      <Spinner isLoading={loading} icon={LoaderPinwheelIcon}>
        <DataTable
          columns={columns}
          data={JobsList}
          filters={filterMemo}
          events={tableEventsMemoized}
        />
      </Spinner>
    </div>
  )
}
