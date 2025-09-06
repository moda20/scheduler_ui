import jobsService from "@/services/JobsService"
import { DataTable } from "@/features/jobsTable/jobsTable"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { getTableColumns, jobActions } from "@/features/jobsTable/interfaces"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Spinner from "@/components/ui/spinner"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { JobUpdateType } from "@/components/job-update-dialog"
import { JobUpdateDialog } from "@/components/job-update-dialog"
import { Button } from "@/components/ui/button"
import {
  PlusIcon,
  LoaderPinwheelIcon,
  FilterIcon,
  Trash2Icon,
  DockIcon,
  CogIcon,
  CrossIcon,
  DropletIcon,
  ServerCog,
  Play,
  BoxSelectIcon,
  TextSelectIcon,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { config } from "@/app/reducers/uiReducer"
import { getConsumersCBox, takeAction } from "@/features/jobsTable/jobsUtils"
import {
  jobsList,
  setJobsList,
  setRunningJobsCount,
} from "@/app/reducers/jobsReducer"
import type { AdvancedJobFilteringDialogHandle } from "@/components/custom/jobsTable/advancedJobFilteringDialog"
import { AdvancedJobFilteringDialog } from "@/components/custom/jobsTable/advancedJobFilteringDialog"
import { ButtonGroup } from "@/components/ui/buttonGroup"
import { toast } from "@/hooks/use-toast"
import { ButtonWithTooltip } from "@/components/custom/general/ButtonWithTooltip"
import { GearIcon, StopIcon } from "@radix-ui/react-icons"
import { SelectIcon } from "@radix-ui/react-select"
import ConfirmationDialogAction from "@/components/confirmationDialogAction"
import { cn } from "@/lib/utils"

export const defaultSortingState = [{ id: "cronSetting", desc: true }]

export default function JobsPage() {
  const [loading, setLoading] = useState(true)
  const [fetchingData, setFetchingStatus] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<any>()
  const [sorting, setSorting] = useState<SortingState>(defaultSortingState)
  const savedConfig = useAppSelector(config)
  const JobsList = useAppSelector(jobsList)
  const dispatch = useAppDispatch()
  const avFilteringRef = useRef<AdvancedJobFilteringDialogHandle>(null)
  const [selectedRowIds, setSelectedRowIds] = useState<any>({})

  async function fetchTableData(inputSorting?: SortingState, avFilters?: any) {
    setFetchingStatus(true)
    setLoading(true)
    return await (
      (avFilters ?? advancedFilters)
        ? jobsService.filterJobs
        : jobsService.getAllJobs
    )(null, inputSorting ?? sorting, avFilters ?? advancedFilters)
      .then(data => {
        dispatch(setJobsList(data))
      })
      .catch(err => {
        dispatch(setJobsList([]))
      })
      .finally(() => {
        setFetchingStatus(false)
        setLoading(false)
      })
  }

  const updateTableData = useCallback(
    (sorting?: any, avFilters?: any) => {
      return Promise.all([getRunningJobs(), fetchTableData(sorting, avFilters)])
    },
    [sorting],
  )

  const onAdvancedFilterChange = useCallback(
    (value: any) => {
      if (!value) {
        avFilteringRef.current?.reset()
      }
      setAdvancedFilters(value)
      updateTableData(undefined, value)
    },
    [updateTableData],
  )

  const onAdvancedExecutionSubmission = useCallback(
    (value: any) => {
      return jobsService
        .queueJobExecution(value)
        .then((data: any) => {
          toast({
            title: `Jobs queued`,
            duration: 2000,
          })
          return data
        })
        .catch(err => {
          toast({
            title: err.message,
            variant: "destructive",
          })
        })
    },
    [updateTableData],
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
      onRowSelectionChange: setSelectedRowIds,
    }),
    [filterAndPaginationChange, updateTableData, selectedRowIds],
  )

  const takeJobsAction = useCallback(
    async (
      row: jobsTableData | null,
      action: jobActions,
      data?: JobUpdateType | any,
      batchProcessIds?: Array<number>,
    ) => {
      setLoading(true)
      await takeAction(row, action, data, batchProcessIds)?.catch(err => {
        console.error(err)
        toast({
          title: err.message,
          variant: "destructive",
        })
      })
      setLoading(false)
      await updateTableData()
    },
    [sorting, selectedRowIds],
  )

  const takeBatchJobsAction = useCallback(
    async (action: jobActions) => {
      await takeJobsAction(
        JobsList[0],
        action,
        undefined,
        Object.keys(selectedRowIds).map(Number),
      )
      setSelectedRowIds({})
    },
    [selectedRowIds, JobsList, takeJobsAction],
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
        <div className="flex gap-2 items-center">
          {Object.keys(selectedRowIds)?.length > 0 && (
            <ButtonGroup>
              <ButtonWithTooltip
                variant="outline"
                onClick={() => setSelectedRowIds({})}
                tooltipContent="Unselect all"
                tooltipContentClassName="text-foreground bg-background border-border border-2"
              >
                <TextSelectIcon /> {Object.keys(selectedRowIds)?.length}
              </ButtonWithTooltip>
              <ConfirmationDialogAction
                title={"Run all Jobs"}
                description={`This will Run all the ${Object.keys(selectedRowIds).length} selected jobs Simultaneously, if you are looking for queuing check, the advanced filtering modal`}
                takeAction={() => takeBatchJobsAction(jobActions.EXECUTE)}
                confirmText={"Run all"}
              >
                <ButtonWithTooltip
                  variant="outline"
                  className="rounded-none border-l-0"
                  tooltipContent="Run all selected jobs"
                  tooltipContentClassName="text-foreground bg-background border-border border-2"
                >
                  <DockIcon /> Run All
                </ButtonWithTooltip>
              </ConfirmationDialogAction>
              <ConfirmationDialogAction
                title={"Schedule all Jobs"}
                description={`This will Schedule all the ${Object.keys(selectedRowIds).length} selected jobs`}
                takeAction={() => takeBatchJobsAction(jobActions.SCHEDULE)}
                confirmText={"Schedule all"}
              >
                <ButtonWithTooltip
                  variant="outline"
                  className="rounded-none border-l-0"
                  tooltipContent="Schedule all selected jobs"
                  tooltipContentClassName="text-foreground bg-background border-border border-2"
                >
                  <GearIcon />
                </ButtonWithTooltip>
              </ConfirmationDialogAction>

              <ConfirmationDialogAction
                title={"Un-schedule all Jobs"}
                description={`This will un-schedule all the ${Object.keys(selectedRowIds).length} selected jobs`}
                takeAction={() => takeBatchJobsAction(jobActions.UNSCHEDULE)}
                confirmText={"Un-schedule all"}
                confirmVariant={"destructive"}
              >
                <ButtonWithTooltip
                  variant="destructive"
                  className="rounded-l-none"
                  tooltipContent="Unschedule all selected jobs"
                  tooltipContentClassName="text-foreground bg-background border-border border-2"
                >
                  <StopIcon />
                </ButtonWithTooltip>
              </ConfirmationDialogAction>
            </ButtonGroup>
          )}

          <ButtonGroup>
            {advancedFilters && (
              <Button
                variant="destructive"
                onClick={() => onAdvancedFilterChange(undefined)}
              >
                <Trash2Icon />
              </Button>
            )}

            <AdvancedJobFilteringDialog
              onSubmit={onAdvancedFilterChange}
              onExecutionSubmit={onAdvancedExecutionSubmission}
              ref={avFilteringRef}
            >
              <Button
                variant="outline"
                className={cn(
                  "border-border",
                  advancedFilters ? "rounded-l-none border-l-0" : "",
                )}
              >
                <FilterIcon /> Advanced filtering
              </Button>
            </AdvancedJobFilteringDialog>
          </ButtonGroup>
        </div>
      </div>
      <Spinner isLoading={loading} icon={LoaderPinwheelIcon}>
        <DataTable
          columns={columns}
          data={JobsList}
          filters={filterMemo}
          events={tableEventsMemoized}
          rowSelection={selectedRowIds}
        />
      </Spinner>
    </div>
  )
}
