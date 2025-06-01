import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, SaveIcon, Trash2, Unlock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import PrefixedInput from "@/components/custom/configs/prefixedInput"
import type { ConfigItem } from "@/models/configs"
import ConfigInputCombo from "@/components/custom/configs/configInputCombo"
import ConfirmationDialogAction from "@/components/confirmationDialogAction"

export interface ConfigBlockProps {
  group: any
  editMode: boolean
  className?: string
  updateGroupTitle: (id: string, title: string) => void
  updateConfigItem: (
    target: string,

    itemId: string,
    value: string | boolean,
    parentId?: string,
  ) => void
  removeConfigItem: (
    itemId: string,
    parentId?: string,
    setValue?: boolean,
  ) => void
  undoGroupRemoval: (id: string) => void
  addConfigItem: (id: string) => void
}
const defaultConfigBlockProps: ConfigBlockProps = {
  group: {},
  editMode: false,
  updateGroupTitle: () => {},
  updateConfigItem: () => {},
  removeConfigItem: () => {},
  undoGroupRemoval: () => {},
  addConfigItem: () => {},
}

export default function ConfigBlock({
  editMode,
  group,
  className,
  updateGroupTitle,
  updateConfigItem,
  removeConfigItem,
  addConfigItem,
  undoGroupRemoval,
}: ConfigBlockProps = defaultConfigBlockProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card
        key={group.id}
        className={cn(
          "shadow-sm border border-border transition-all duration-200 py-0",
          group.deleted
            ? "opacity-50 pointer-events-none cursor-not-allowed"
            : "",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between text-foreground bg-background">
            {editMode ? (
              <Input
                value={group.title ?? ""}
                onChange={e => updateGroupTitle(group.id, e.target.value)}
                className="text-2xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0 rounded-none"
              />
            ) : (
              <CardTitle className="text-2xl text-foreground bg-background capitalize">
                {group.title}
              </CardTitle>
            )}
            {editMode && group.subGroups?.length > 0 && (
              <ConfirmationDialogAction
                title={"Delete the entire block"}
                description={`This will delete the entire block and all it's sub Items`}
                takeAction={() => removeConfigItem(group.id)}
                confirmText={"Delete config block"}
                confirmVariant={"default"}
              >
                <Button
                  variant={"destructive"}
                  size="sm"
                  disabled={group.subGroups?.some((sg: any) => sg.base)}
                  className="border-none focus:ring-0 outline-none"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </ConfirmationDialogAction>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-foreground bg-background rounded-xl">
          <div className="grid gap-4">
            {group.subGroups ? (
              group.subGroups.map((sg: any) => (
                <ConfigInputCombo
                  key={sg.id}
                  item={sg}
                  editMode={editMode}
                  removeConfigItem={(itemId, setValue) =>
                    removeConfigItem(itemId, group.id, setValue)
                  }
                  updateConfigItem={(...args) =>
                    updateConfigItem(...args, group.id)
                  }
                />
              ))
            ) : (
              <ConfigInputCombo
                item={group}
                editMode={editMode}
                removeConfigItem={(id, setValue) =>
                  removeConfigItem(id, undefined, setValue)
                }
                updateConfigItem={updateConfigItem}
              />
            )}

            {group.subGroups && editMode && (
              <Button
                variant="dashed"
                onClick={() => addConfigItem(group.id)}
                className="w-full gap-2 border-dashed border border-border hover:border-solid"
              >
                <Plus className="h-4 w-4" />
                Add Configuration Item
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {group.deleted && (
        <div className="absolute inset-0 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <Button
            variant="default"
            size="sm"
            className={`transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}`}
            onClick={() => undoGroupRemoval(group.id)}
          >
            <Unlock className="w-4 h-4 mr-2" />
            Undo deletion
          </Button>
        </div>
      )}
    </div>
  )
}
