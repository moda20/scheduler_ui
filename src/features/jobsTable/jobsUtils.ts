import { jobActions, jobsTableData } from "@/features/jobsTable/interfaces"
import type { JobUpdateType } from "@/components/job-update-dialog"
import jobsService from "@/services/JobsService"
import { toast } from "@/hooks/use-toast"
import type { ComboBoxItem } from "@/components/ui/combo-box"
import { notificationService } from "@/services/notificationsService"

export const takeAction = (
  row: jobsTableData | null,
  action: jobActions,
  data?: JobUpdateType | any,
  batchProcessIds?: number[],
) => {
  switch (action) {
    case jobActions.SCHEDULE:
      return jobsService
        .executeAction(row!.id, "START", batchProcessIds)
        .then(data => {
          toast({
            title: `${batchProcessIds?.length ?? ""} Service${!batchProcessIds ? " " + row!.name : "s"} Scheduled`,
            duration: 3000,
          })
        })
    case jobActions.UNSCHEDULE:
      return jobsService
        .executeAction(row!.id, "STOP", batchProcessIds)
        .then(data => {
          toast({
            title: `${batchProcessIds?.length ?? ""} Service${!batchProcessIds ? " " + row!.name : "s"} De-scheduled`,
            duration: 3000,
          })
        })
    case jobActions.EXECUTE:
    case jobActions.EXECUTE_IN_THE_BACKGROUND:
      return jobsService
        .executeAction(row!.id, "EXECUTE", batchProcessIds)
        .then(() => {
          toast({
            title: `${batchProcessIds?.length ?? ""} Service${!batchProcessIds ? " " + row!.name : "s"} Launched`,
            duration: 3000,
          })
        })
        .catch(err => {
          toast({
            title: err.message,
            variant: "destructive",
          })
        })
    case jobActions.EXECUTE_WITH_PARAMS:
      if (data.param) {
        data.param = JSON.stringify(JSON.parse(data.param))
      }
      return jobsService
        .executeActionWithUpdate("EXECUTE_WITH_PARAMS", data, row!.id)
        .then(() => {
          toast({
            title: `Custom service ${row!.name} Launched`,
            duration: 3000,
          })
        })
        .catch(err => {
          toast({
            title: err.message,
            variant: "destructive",
          })
        })
    case jobActions.REFRESH:
      return jobsService.executeAction(row!.id, "REFRESH").then(() => {
        toast({
          title: `Service ${row!.name} Refreshed`,
          duration: 3000,
        })
      })
    case jobActions.UPDATE:
      if (data.param) {
        data.param = JSON.stringify(JSON.parse(data.param))
      }
      return jobsService
        .executeActionWithUpdate("UPDATE", data, row!.id)
        .then(() => {
          toast({
            title: `Service ${row!.name} Updated`,
            duration: 3000,
          })
        })
    case jobActions.CREATE:
      if (data.param) {
        data.param = JSON.stringify(JSON.parse(data.param))
      }
      return jobsService
        .executeActionWithUpdate(
          "CREATE",
          {
            ...data,
            status: "STOPPED",
            exclusive: true,
          },
          undefined,
        )
        .then(() => {
          toast({
            title: `Service ${data.name} Created`,
            duration: 3000,
          })
        })

    case jobActions.SOFT_DELETE:
      return jobsService.isJobRunning(row!.id).then((data: any) => {
        if (data) {
          toast({
            title: `Service ${row!.name} is running and cannot be deleted`,
            variant: "destructive",
          })
        } else {
          return jobsService
            .executeAction(row!.id, "SOFT_DELETE")
            .then(() => {
              toast({
                title: `Service ${row!.name} deleted`,
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
    case jobActions.EXPORT:
      return jobsService
        .exportJobsToJSON(undefined, batchProcessIds)
        .then(() => {
          toast({
            title: `${batchProcessIds?.length} jobs exported to JSON`,
          })
        })
        .catch(err => {
          toast({
            title: err.message,
            variant: "destructive",
          })
        })

    case jobActions.UPDATE_EVENT_HANDLER:
      return notificationService
        .updateEventHandler(Number(row.id), data)
        .then(() => {
          toast({
            title: "Event handler updated successfully",
            duration: 1000,
          })
        })
        .catch(err => {
          toast({
            title: "Failed to update event handler",
            description: err.message || "An error occurred",
            variant: "destructive",
            duration: 2000,
          })
        })
    case jobActions.DELETE_EVENT_HANDLER:
      return notificationService
        .deleteEventHandler(Number(row.id), data)
        .then(() => {
          toast({
            title: "Event handler deleted successfully",
            duration: 1000,
          })
        })
        .catch(err => {
          toast({
            title: "Failed to delete event handler",
            description: err.message || "An error occurred",
            variant: "destructive",
            duration: 2000,
          })
        })
  }
}

export const getConsumersCBox = (): Promise<ComboBoxItem[]> => {
  return jobsService.getAvailableConsumers().then((data: Array<Object>) => {
    return data.map((item: any) => {
      return {
        value: item,
        label: item,
      }
    })
  })
}
