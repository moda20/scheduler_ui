import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  JNTriggerNames,
  JobEventHandlerConfig,
  JobNotificationTriggers,
  JobNotificationTypes,
  JNTypesNames,
  AvailableTypesPerTrigger,
} from "@/models/jobs"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PlusIcon, SaveIcon, EditIcon, TrashIcon } from "lucide-react"
import useDialogueManager from "@/hooks/useDialogManager"
import { useCallback, useEffect, useMemo, useState } from "react"
import { NotificationServiceDropdown } from "./NotificationServiceDropdown"
import type { NotificationServiceDropdownItem } from "./NotificationServiceDropdown"
import { notificationService } from "@/services/notificationsService"
import type { NotificationService } from "@/models/notifications"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Spinner from "@/components/custom/LoadingOverlay"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import EventHandlerTitle from "@/components/custom/jobsTable/JobEvents/EventHandlerTitle"

export interface EventHandlerModalProps {
  children: React.ReactNode
  isCreateMode: boolean
  eventHandler?: JobEventHandlerConfig
  jobId?: string
  onSave: (eventHandler: JobEventHandlerConfig) => void
  onDelete?: (configId: string) => Promise<void>
  onOpenChange?: (open: boolean) => void
}

const eventHandlerFormSchema = z.object({
  trigger: z.string({ error: "the trigger is required" }),
  notification_type: z
    .array(z.string())
    .min(1, "Select at least one event type"),
  notification_service_id: z.number({
    message: "Select a notification service",
  }),
  regex: z.string().optional(),
  durationThreshold: z.number().optional(),
})

export type EventHandlerFormValues = z.infer<typeof eventHandlerFormSchema>

export default function EventHandlerModal({
  children,
  isCreateMode,
  eventHandler,
  onSave,
  onOpenChange,
  onDelete,
}: EventHandlerModalProps) {
  const form = useForm<EventHandlerFormValues>({
    resolver: zodResolver(eventHandlerFormSchema),
    defaultValues: {
      trigger: eventHandler?.trigger,
      notification_type: eventHandler?.notification_type || [],
      notification_service_id: eventHandler?.notification_service_id || 0,
      regex: eventHandler?.regex || "",
      durationThreshold: eventHandler?.durationThreshold || undefined,
    },
  })

  const { isDialogOpen, setDialogState } = useDialogueManager()
  const [loading, setLoading] = useState(false)

  const [notificationServices, setNotificationServices] = useState<
    NotificationService[]
  >([])
  const [loadingServices, setLoadingServices] = useState(false)

  useEffect(() => {
    if (!isDialogOpen) return
    setLoadingServices(true)
    notificationService
      .getAllNotificationServices()
      .then((response: any) => {
        setNotificationServices(response.data || [])
      })
      .catch(err => {
        console.error("Failed to fetch notification services:", err)
      })
      .finally(() => {
        setLoadingServices(false)
      })
  }, [isDialogOpen])

  const notificationServiceOptions =
    useMemo((): NotificationServiceDropdownItem[] => {
      return notificationServices.map(service => ({
        value: service.id as number,
        label: service.name,
        image: service.image,
        description: service.description,
      }))
    }, [notificationServices])

  const serviceId = form.watch("notification_service_id")

  const selectedNotificationServiceOption = useMemo(() => {
    return notificationServiceOptions.find(s => s.value === serviceId)
  }, [notificationServices, serviceId])

  const selectedNotificationService = useMemo(() => {
    return notificationServices.find(s => s.id === serviceId)
  }, [notificationServices, serviceId])

  const triggerType = form.watch("trigger")

  const isRegexTrigger =
    triggerType === JobNotificationTriggers.REGEX_MESSAGE_MATCH

  const isDurationThresholdTrigger =
    triggerType === JobNotificationTriggers.DURATION_THRESHOLD

  const handleClose = useCallback(
    (open: boolean) => {
      setDialogState(open)
      if (!open) {
        form.reset()
        onOpenChange?.(false)
      }
    },
    [form, setDialogState, onOpenChange],
  )

  const onSubmit = useCallback(
    (values: EventHandlerFormValues) => {
      const newEventHandler: JobEventHandlerConfig = {
        config_id: eventHandler?.config_id,
        notification_type: values.notification_type as JobNotificationTypes[],
        trigger: values.trigger as JobNotificationTriggers,
        notification_service_id: values.notification_service_id,
        regex:
          values.trigger === JobNotificationTriggers.REGEX_MESSAGE_MATCH
            ? values.regex
            : undefined,
        durationThreshold:
          values.trigger === JobNotificationTriggers.DURATION_THRESHOLD ||
          values.trigger === JobNotificationTriggers.DURATION_DELTA
            ? values.durationThreshold
            : undefined,
      }

      onSave(newEventHandler)
      handleClose(false)
    },
    [isCreateMode, eventHandler, onSave, handleClose],
  )

  const onHandlerDeletion = useCallback(
    async (action: ConfirmationDialogActionType) => {
      if (action === ConfirmationDialogActionType.CANCEL) return
      if (onDelete) {
        setLoading(true)
        await onDelete(eventHandler.config_id)
        setLoading(false)
        handleClose(false)
      }
    },
    [isCreateMode, eventHandler, onDelete],
  )

  const toggleConditionType = (type: JobNotificationTriggers) => {
    form.setValue("trigger", type)
  }

  const toggleNotificationType = (
    type: JobNotificationTypes,
    checked: boolean,
  ) => {
    const currentTypes = form.getValues(
      "notification_type",
    ) as JobNotificationTypes[]
    if (checked) {
      form.setValue("notification_type", [...currentTypes, type])
    } else {
      form.setValue(
        "notification_type",
        currentTypes.filter(t => t !== type),
      )
    }
  }

  const availableObjectTypes = useMemo(() => {
    return AvailableTypesPerTrigger[triggerType]
  }, [triggerType])

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogTrigger
        asChild
        onClick={e => {
          e.preventDefault()
          setDialogState(true)
          onOpenChange?.(true)
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col text-foreground bg-background"
        onEscapeKeyDown={e => {
          e.preventDefault()
          handleClose(false)
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCreateMode ? (
              <>
                <PlusIcon className="h-5 w-5" />
                Create Event Handler
              </>
            ) : (
              <>
                <EditIcon className="h-5 w-5" />
                Update Event Handler
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Configure a new event notification handler"
              : "Update the event notification handler configuration"}
          </DialogDescription>
        </DialogHeader>

        <Spinner isLoading={loading}>
          <ScrollArea className="flex-1 pr-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {isCreateMode && (
                  <FormField
                    control={form.control}
                    name="trigger"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Condition</FormLabel>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.values(JobNotificationTriggers)?.map(type => (
                            <div
                              key={String(type)}
                              className="flex items-center space-x-2 p-3 border-border border-2 rounded-lg hover:bg-muted/50"
                            >
                              <Checkbox
                                id={`type-${type}`}
                                checked={field.value === type}
                                onCheckedChange={checked =>
                                  toggleConditionType(type, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={`type-${type}`}
                                className="flex-1 cursor-pointer font-normal"
                              >
                                {JNTriggerNames[type]}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notification_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Triggers</FormLabel>
                      <div className="grid grid-cols-1 gap-2">
                        {availableObjectTypes?.map(type => (
                          <div
                            key={String(type)}
                            className="flex items-center space-x-2 p-3 border-border border-2 rounded-lg hover:bg-muted/50"
                          >
                            <Checkbox
                              id={`type-${type}`}
                              checked={field.value.includes(type)}
                              onCheckedChange={checked =>
                                toggleNotificationType(type, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`type-${type}`}
                              className="flex-1 cursor-pointer font-normal"
                            >
                              {JNTypesNames[type]}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="h-1" />
                {!isCreateMode && triggerType && (
                  <div className="bg-muted rounded-lg">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Condition
                    </Label>
                    <p className="text-sm mt-1">
                      {JNTriggerNames[triggerType]}
                    </p>
                  </div>
                )}

                {isRegexTrigger ? (
                  <FormField
                    control={form.control}
                    name="regex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regex Pattern</FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0 focus-visible:border-2"
                            placeholder="Enter regex pattern to match"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                {isDurationThresholdTrigger ? (
                  <FormField
                    control={form.control}
                    name="durationThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration Threshold (seconds)</FormLabel>
                        <FormControl className="w-full">
                          <Input
                            className="focus-visible:ring-0 focus-visible:border-2"
                            type="number"
                            placeholder="Enter duration threshold in seconds"
                            {...field}
                            value={field.value || ""}
                            onChange={e => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                <FormField
                  control={form.control}
                  name="notification_service_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Service</FormLabel>
                      <FormControl className="w-full">
                        <NotificationServiceDropdown
                          defaultValue={selectedNotificationServiceOption}
                          onChange={service => {
                            if (service) {
                              field.onChange(service.value)
                            }
                          }}
                          inputOptions={notificationServiceOptions}
                          inputPlaceholder="Select notification service"
                          disabled={loadingServices}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            {!isCreateMode && (
              <div className="text-sm italic text-muted-foreground break-after-auto mt-2">
                <span className="text-yellow-500">⚠</span> Note: event
                notification updates will only affect new tasks (i.e. jobs
                triggered after this update concludes)
              </div>
            )}
          </ScrollArea>
        </Spinner>

        <DialogFooter>
          {!isCreateMode && (
            <ConfirmationDialogAction
              title={"Delete Event Handler "}
              description={
                <div className="flex flex-col gap-2">
                  You are going to delete the following event handler, this is
                  irreversible
                  <EventHandlerTitle
                    eventHandler={eventHandler}
                    notificationService={selectedNotificationService}
                  />
                </div>
              }
              takeAction={onHandlerDeletion}
              confirmText={"Delete handler"}
              confirmVariant="destructive"
              autoFocus={true}
            >
              <Button variant="destructive" className="mr-auto">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Handler
              </Button>
            </ConfirmationDialogAction>
          )}

          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={loadingServices}
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {isCreateMode ? "Create Handler" : "Update Handler"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
