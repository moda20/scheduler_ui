import { AnimatePresence, motion } from "framer-motion"
import { NotificationType } from "@/models/notifications"
import NotificationServicesPanel from "@/components/custom/notifications/NotificationServicesPanel"
import GlobalEventHandlersPanel from "@/components/custom/notifications/GlobalEventHandlersPanel"

interface NotificationCenterProps {
  activeView: NotificationType
}

const variants = {
  enter: {
    x: 20,
    opacity: 0.5,
    transition: {
      duration: 0.08,
    },
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.05,
    },
  },
  exit: {
    x: -20,
    opacity: 0.5,
    transition: {
      duration: 0.08,
    },
  },
}

export function NotificationCenter({ activeView }: NotificationCenterProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeView}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="h-full"
        >
          {activeView === "services" && <NotificationServicesPanel />}
          {activeView === "globalEventHandlers" && <GlobalEventHandlersPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
