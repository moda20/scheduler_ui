import {
  JNTriggerNames,
  JNTypesNames,
  JobEventHandlerConfig,
  JobNotificationTriggers,
  JobNotificationTypes,
} from "@/models/jobs"
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Clock,
  Info,
  RegexIcon,
  Shield,
  Timer,
} from "lucide-react"
import BImage from "@/components/custom/general/PublicBackendImage"
import type { ReactNode } from "react"
import { NotificationService } from "@/models/notifications"

export function getNotificationTypeIcon(type: JobNotificationTypes): ReactNode {
  switch (type) {
    case JobNotificationTypes.JOB_EVENT_ERROR:
      return <AlertCircle className="h-4 w-4" />
    case JobNotificationTypes.JOB_EVENT_WARNING:
      return <AlertTriangle className="h-4 w-4" />
    case JobNotificationTypes.JOB_EVENT_INFO:
      return <Info className="h-4 w-4" />
    case JobNotificationTypes.JOB_DURATION:
      return <Timer className="h-4 w-4" />
    case JobNotificationTypes.JOB_EVENT:
    default:
      return <Bell className="h-4 w-4" />
  }
}

export function getTriggerIcon(trigger: JobNotificationTriggers): ReactNode {
  switch (trigger) {
    case JobNotificationTriggers.REGEX_MESSAGE_MATCH:
      return <RegexIcon className="h-5 w-5" />
    case JobNotificationTriggers.DURATION_THRESHOLD:
      return <Clock className="h-5 w-5" />
    case JobNotificationTriggers.DURATION_DELTA:
      return <Shield className="h-5 w-5" />
  }
}

export default function EventHandlerTitle({
  eventHandler,
  notificationService,
}: {
  eventHandler: JobEventHandlerConfig
  notificationService?: NotificationService
}) {
  const notificationTypes = Array.isArray(eventHandler.notification_type)
    ? eventHandler.notification_type
    : [eventHandler.notification_type]
  return (
    <div className="flex items-center gap-2 text-left flex-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {notificationTypes.length === 1 ? (
          <>{getNotificationTypeIcon(notificationTypes[0])}</>
        ) : (
          <Bell className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {notificationTypes.length === 1
            ? JNTypesNames[notificationTypes[0]]
            : `${notificationTypes.length} Events`}
        </span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {getTriggerIcon(eventHandler.trigger)}
        <span className="text-sm">{JNTriggerNames[eventHandler.trigger]}</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
      {notificationService?.image ? (
        <BImage
          src={notificationService.image}
          alt={notificationService.name}
          className="h-5 w-5 rounded-md object-cover"
        />
      ) : (
        <p className="text-sm font-medium text-foreground">
          {notificationService?.name ||
            `Service #${eventHandler.notification_service_id}`}
        </p>
      )}
    </div>
  )
}
