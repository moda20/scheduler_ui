import SheetActionDialog from "@/components/sheet-action-dialog"
import type { ReactNode } from "react"
import JobEventNotificationsList from "@/components/custom/jobsTable/JobEvents/JobEventNotificationsList"
import type { JobEventHandlerConfig } from "@/models/jobs"
import type { jobsTableData } from "@/features/jobsTable/interfaces"

interface JobEventNotificationsSheetProps {
  eventHandlers: JobEventHandlerConfig[]
  trigger: ReactNode
  JobDetails: jobsTableData
  title?: string
  description?: string
  modal?: boolean
  onNotificationChange: (handlerData: any) => Promise<void>
  onNotificationDelete?: (configId: string) => Promise<void>
}

export default function JobEventNotificationsDrawer({
  eventHandlers,
  trigger,
  modal = true,
  JobDetails,
  onNotificationChange,
  onNotificationDelete,
}: JobEventNotificationsSheetProps) {
  return (
    <SheetActionDialog
      side="right"
      title={`${JobDetails.name} Event Notifications (${eventHandlers?.length})`}
      description="View and manage event notification configurations"
      trigger={trigger}
      modal={modal}
      contentClassName="w-[500px] sm:w-[600px] sm:max-w-[600px]"
    >
      <div className="py-4">
        <JobEventNotificationsList
          eventHandlers={eventHandlers}
          JobDetails={JobDetails}
          onUpdate={onNotificationChange}
          onDelete={onNotificationDelete}
        />
      </div>
    </SheetActionDialog>
  )
}
