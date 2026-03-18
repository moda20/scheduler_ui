import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "@/services/notificationsService"
import { EmptyState } from "@/components/custom/general/EmptyState"
import { Bell, Plus } from "lucide-react"
import EventHandlerCard from "@/components/custom/jobsTable/JobEvents/EventHandlerCard"
import { useCallback } from "react"
import { JobEventHandlerConfig } from "@/models/jobs"
import { toast } from "@/hooks/use-toast"
import LoadingOverlay from "@/components/custom/LoadingOverlay"
import EventHandlerModal from "@/components/custom/jobsTable/JobEvents/EventHandlerModal"
import { Button } from "@/components/ui/button"

export default function GlobalEventHandlersPanel() {
  const queryClient = useQueryClient()
  const {
    error,
    isLoading,
    data: handlers,
  } = useQuery({
    queryKey: ["globalEventHandlers"],
    queryFn: notificationService.getGlobalEventHandlers,
  })

  const { isLoading: servicesLoading, data: services } = useQuery({
    queryKey: ["notificationServices"],
    placeholderData: {},
    queryFn: () =>
      notificationService.getAllNotificationServices().then(d =>
        d.data?.reduce(
          (p, c) => {
            p[c.id] = c
            return p
          },
          {} as Record<string, any>,
        ),
      ),
  })

  const createOrUpdateGlobalHandler = useCallback(
    async (handler: JobEventHandlerConfig) => {
      return notificationService.updateGlobalHandler(handler, handler.config_id)
    },
    [],
  )

  const updateGlobalHandler = useMutation({
    mutationFn: createOrUpdateGlobalHandler,
    onError: () => {
      toast({
        title: "Error updating global event handler",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        title: "Event handler updated",
        duration: 1500,
      })
      queryClient.invalidateQueries({ queryKey: ["globalEventHandlers"] })
    },
  })

  const deleteGlobalHandler = useCallback(async (configId: string) => {
    return notificationService.deleteGlobalEventHandler(configId)
  }, [])

  const deleteGlobalHandlerMutation = useMutation({
    mutationFn: deleteGlobalHandler,
    onError: () => {
      toast({
        title: "Error deleting global event handler",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        title: "Event handler deleted",
        duration: 1500,
      })
      queryClient.invalidateQueries({ queryKey: ["globalEventHandlers"] })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className={"flex flex-col gap-1 mb-4"}>
          <h2 className="text-2xl font-bold tracking-tight">
            Global Event handlers
          </h2>
          <p className="text-md font-light">
            Event handlers that are going to be triggered for all jobs.
          </p>
        </div>
        <EventHandlerModal
          isCreateMode={true}
          onSave={updateGlobalHandler.mutateAsync}
        >
          <Button
            size="sm"
            variant="outline"
            className="gap-2 xs:mr-auto sm:ml-auto "
            disabled={updateGlobalHandler.isPending}
          >
            <Plus className="h-4 w-4" />
            Add a global handler
          </Button>
        </EventHandlerModal>
      </div>
      <LoadingOverlay
        isLoading={
          servicesLoading ||
          updateGlobalHandler.isPending ||
          deleteGlobalHandlerMutation.isPending
        }
      >
        {error || !handlers?.length ? (
          <div className="flex flex-col gap-2 p-2 w-full  justify-center">
            <EmptyState
              icon={Bell}
              title={"No Global event handlers configured"}
            />
            <div className="w-full flex items-center justify-center px-1">
              <EventHandlerModal
                isCreateMode={true}
                onSave={updateGlobalHandler.mutateAsync}
              >
                <Button
                  size="default"
                  variant="outline"
                  className="gap-2"
                  disabled={updateGlobalHandler.isPending}
                >
                  <Plus className="h-4 w-4" />
                  Add a global handler
                </Button>
              </EventHandlerModal>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full items-center justify-end px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {handlers.map(handler => {
                return (
                  <LoadingOverlay isLoading={updateGlobalHandler.isPending}>
                    <EventHandlerCard
                      handler={handler}
                      notificationService={
                        services?.[handler.notification_service_id]
                      }
                      handleUpdateEventHandler={updateGlobalHandler.mutateAsync}
                      onDelete={deleteGlobalHandlerMutation.mutateAsync}
                    />
                  </LoadingOverlay>
                )
              })}
            </div>
          </div>
        )}
      </LoadingOverlay>
    </div>
  )
}
