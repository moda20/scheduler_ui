import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Bell, Briefcase, Edit, Plus, Search, Tag } from "lucide-react"
import { EmptyState } from "@/components/custom/general/EmptyState"
import { notificationService } from "@/services/notificationsService"
import type { NotificationService } from "@/models/notifications"
import {
  JNTypesNames,
  JobEventHandlerConfig,
  JobNotificationTriggers,
} from "@/models/jobs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import BImage from "@/components/custom/general/PublicBackendImage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import LoadingOverlay from "@/components/custom/LoadingOverlay"
import { Button } from "@/components/ui/button"
import EventHandlerModal from "@/components/custom/jobsTable/JobEvents/EventHandlerModal"
import { jobsTableData } from "@/features/jobsTable/interfaces"
import EventHandlerTitle, {
  getNotificationTypeIcon,
  getTriggerIcon,
} from "@/components/custom/jobsTable/JobEvents/EventHandlerTitle"
import { toast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"

interface JobEventNotificationsDrawerProps {
  eventHandlers: JobEventHandlerConfig[]
  JobDetails: jobsTableData
  notificationServices: Map<number, NotificationService>
  onUpdate: (handlerData: any) => Promise<void>
  onDelete?: ({
    configId,
    cb,
  }: {
    configId: string
    cb?: () => Promise<void>
  }) => Promise<void>
}

export default function JobEventNotificationsList({
  eventHandlers,
  onUpdate,
  JobDetails,
  onDelete,
  notificationServices,
}: JobEventNotificationsDrawerProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateEventHandler = useCallback(
    async ({
      handler,
    }: {
      handler: JobEventHandlerConfig
      cb?: () => Promise<void>
    }) => {
      setIsSaving(true)
      return onUpdate(handler).finally(() => {
        setIsSaving(false)
      })
    },
    [JobDetails, onUpdate],
  )

  if (!eventHandlers || eventHandlers.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full items-center justify-center px-1">
        <EmptyState
          icon={Bell}
          title="No Event Notifications"
          description="This job doesn't have any event notification configurations yet."
          className="py-8"
        />
        <EventHandlerModal
          isCreateMode={true}
          onSave={handleUpdateEventHandler}
        >
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New event notification
          </Button>
        </EventHandlerModal>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <LoadingOverlay isLoading={isSaving}>
        <ScrollArea className="flex-1">
          <div className="flex w-full items-center justify-end px-1">
            <EventHandlerModal
              isCreateMode={true}
              onSave={handleUpdateEventHandler}
            >
              <Button size="sm" variant="outline" className="gap-2 ml-auto">
                <Plus className="h-4 w-4" />
                Add event notification
              </Button>
            </EventHandlerModal>
          </div>
          <Accordion type="multiple" className="w-full">
            {eventHandlers.map(handler => {
              const service = notificationServices.get(
                handler.notification_service_id,
              )
              const notificationTypes = Array.isArray(handler.notification_type)
                ? handler.notification_type
                : [handler.notification_type]
              return (
                <AccordionItem
                  key={handler.config_id}
                  value={handler.config_id}
                  className="border-b-2 border-border"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <EventHandlerTitle
                      eventHandler={handler}
                      notificationService={service}
                    />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2 relative">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              Notification Service
                            </span>
                          </div>
                          <div className="relative">
                            <LoadingOverlay isLoading={!notificationServices}>
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0">
                                  {service?.image ? (
                                    <BImage
                                      src={service.image}
                                      alt={service.name}
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
                                    {service?.name ||
                                      `Service #${handler.notification_service_id}`}
                                  </p>
                                  {service?.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                      {service.description}
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 ml-auto"
                          >
                            <Edit className="h-4 w-4" />
                            Update Handler
                          </Button>
                        </EventHandlerModal>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </ScrollArea>
      </LoadingOverlay>
    </div>
  )
}
