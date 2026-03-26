import { motion, AnimatePresence } from "framer-motion"

import { SystemPanel } from "./SystemPanel"
import { LoggingPanel } from "./LoggingPanel"
import { NotificationsPanel } from "./NotificationsPanel"
import { CustomPanel } from "./CustomPanel"
import { CategorizedConfigs, ConfigViewType } from "@/models/configs"

interface ConfigCenterProps {
  activeView: ConfigViewType
  categorizedConfigs: CategorizedConfigs
  editMode: boolean
  addConfigItem: (id?: string, type?: "block" | "item") => void
  removeConfigItem: (
    itemId: string,
    parentId?: string,
    setValue?: boolean,
  ) => void
  updateConfigItem: (
    target: string,
    value: string | boolean,
    path?: string[],
  ) => void
  updateGroupTitle: (id: string, title: string) => void
  undoGroupRemoval: (id: string) => void
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
    x: 0,
    opacity: 0.5,
    transition: {
      duration: 0.08,
    },
  },
}

export function ConfigCenter({
  activeView,
  categorizedConfigs,
  editMode,
  addConfigItem,
  removeConfigItem,
  updateConfigItem,
  updateGroupTitle,
  undoGroupRemoval,
}: ConfigCenterProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeView}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="h-full overflow-hidden"
      >
        {activeView === "system" && (
          <SystemPanel
            configs={categorizedConfigs.system}
            editMode={editMode}
            addConfigItem={addConfigItem}
            removeConfigItem={removeConfigItem}
            updateConfigItem={updateConfigItem}
            updateGroupTitle={updateGroupTitle}
            undoGroupRemoval={undoGroupRemoval}
          />
        )}
        {activeView === "logging" && (
          <LoggingPanel
            configs={categorizedConfigs.logging}
            editMode={editMode}
            addConfigItem={addConfigItem}
            removeConfigItem={removeConfigItem}
            updateConfigItem={updateConfigItem}
            updateGroupTitle={updateGroupTitle}
            undoGroupRemoval={undoGroupRemoval}
          />
        )}
        {activeView === "notifications" && (
          <NotificationsPanel
            configs={categorizedConfigs.notifications}
            editMode={editMode}
            addConfigItem={addConfigItem}
            removeConfigItem={removeConfigItem}
            updateConfigItem={updateConfigItem}
            updateGroupTitle={updateGroupTitle}
            undoGroupRemoval={undoGroupRemoval}
          />
        )}
        {activeView === "custom" && (
          <CustomPanel
            configs={categorizedConfigs.custom}
            editMode={editMode}
            addConfigItem={addConfigItem}
            removeConfigItem={removeConfigItem}
            updateConfigItem={updateConfigItem}
            updateGroupTitle={updateGroupTitle}
            undoGroupRemoval={undoGroupRemoval}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
