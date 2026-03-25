import type { ConfigItem } from "@/models/configs"
import ConfigBlock from "./configBlock"
import { ConfigAddBlock } from "@/components/custom/configs/ConfigAddBlock"

interface NotificationsPanelProps {
  configs: ConfigItem[]
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

export function NotificationsPanel({
  configs,
  editMode,
  addConfigItem,
  removeConfigItem,
  updateConfigItem,
  updateGroupTitle,
  undoGroupRemoval,
}: NotificationsPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-md font-light">
          Manage notification service configurations
        </p>
      </div>
      <div className="space-y-4">
        {configs?.map(snf => {
          return (
            <ConfigBlock
              key={snf.id}
              group={snf}
              editMode={editMode}
              addConfigItem={addConfigItem}
              removeConfigItem={removeConfigItem}
              updateConfigItem={updateConfigItem}
              updateGroupTitle={updateGroupTitle}
              undoGroupRemoval={undoGroupRemoval}
            />
          )
        })}
      </div>
    </div>
  )
}
