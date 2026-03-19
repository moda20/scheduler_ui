import { Bell, Briefcase, Edit, Search, Tag } from "lucide-react"
import LoadingOverlay from "@/components/custom/LoadingOverlay"
import BImage from "@/components/custom/general/PublicBackendImage"
import { Badge } from "@/components/ui/badge"
import {
  getNotificationTypeIcon,
  getTriggerIcon,
} from "@/components/custom/jobsTable/JobEvents/EventHandlerTitle"
import {
  JNTypesNames,
  JobEventHandlerConfig,
  JobNotificationTriggers,
} from "@/models/jobs"
import { cn } from "@/lib/utils"
import EventHandlerModal from "@/components/custom/jobsTable/JobEvents/EventHandlerModal"
import { Button } from "@/components/ui/button"
import { NotificationService } from "@/models/notifications"
import { jobsTableData } from "@/features/jobsTable/interfaces"
import { Card, CardContent } from "@/components/ui/card"

export interface EventHandlerCardProps {
  handler: JobEventHandlerConfig
  notificationService?: NotificationService
  serviceLoader?: boolean
  handleUpdateEventHandler: ({
    handler,
    cb,
  }: {
    handler: JobEventHandlerConfig
    cb?: () => void
  }) => Promise<void>
  onDelete?: ({
    configId,
    cb,
  }: {
    configId: string
    cb?: () => void
  }) => Promise<void>
}

export default function EventHandlerCard({
  handler,
  notificationService,
  serviceLoader,
  handleUpdateEventHandler,
  onDelete,
}: EventHandlerCardProps) {
  const notificationTypes = Array.isArray(handler.notification_type)
    ? handler.notification_type
    : [handler.notification_type]
  console.log(notificationService)
  return (
    <Card className="border-border ">
      <CardContent className="border-border p-4 py-2">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 relative">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="font-medium">Notification Service</span>
              </div>
              <div className="relative">
                <LoadingOverlay isLoading={serviceLoader}>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0">
                      {notificationService?.image ? (
                        <BImage
                          src={notificationService.image}
                          alt={notificationService.name}
                          className="h-8 w-8 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notificationService?.name ||
                          `Service #${handler.notification_service_id}`}
                      </p>
                      {notificationService?.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notificationService.description}
                        </p>
                      )}
                    </div>
                  </div>
                </LoadingOverlay>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span className="font-medium">
                  Trigger{notificationTypes.length > 1 ? "s" : ""} :
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {notificationTypes.map(type => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {getNotificationTypeIcon(type)}
                    {JNTypesNames[type]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
                <span className="font-medium">Condition</span>
              </div>
              <div className="flex gap-2 items-center">
                {getTriggerIcon(handler.trigger)}
                {handler.trigger ===
                  JobNotificationTriggers.REGEX_MESSAGE_MATCH &&
                  handler.regex && (
                    <pre
                      className={cn(
                        "rounded-md bg-muted px-2.5 py-1.5 text-xs",
                        "font-mono overflow-x-auto text-foreground",
                        "border border-border/50",
                      )}
                    >
                      {handler.regex}
                    </pre>
                  )}
                {handler.trigger ===
                  JobNotificationTriggers.DURATION_THRESHOLD &&
                  handler.durationThreshold !== undefined && (
                    <div>{handler.durationThreshold}s</div>
                  )}
              </div>
            </div>
          </div>

          <div className="flex w-full p-1">
            <EventHandlerModal
              isCreateMode={false}
              eventHandler={handler}
              onSave={handleUpdateEventHandler}
              onDelete={onDelete}
            >
              <Button size="sm" variant="outline" className="gap-2 ml-auto">
                <Edit className="h-4 w-4" />
                Update Handler
              </Button>
            </EventHandlerModal>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
