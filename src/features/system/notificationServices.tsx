import { useCallback, useEffect, useMemo, useState } from "react"

import { NotificationCenter } from "@/components/custom/notifications/NotificationCenter"
import { NotificationAside } from "@/components/custom/notifications/NotificationAside"
import { NotificationType } from "@/models/notifications"
import useDialogueManager from "@/hooks/useDialogManager"

export default function NotificationServices() {
  const [activeView, setActiveView] = useState<NotificationType>("services")

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden gap-2">
        <NotificationAside
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <NotificationCenter activeView={activeView} />
      </div>
    </div>
  )
}
