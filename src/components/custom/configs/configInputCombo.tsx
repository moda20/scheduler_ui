import type { ConfigItem } from "@/models/configs"
import PrefixedInput from "@/components/custom/configs/prefixedInput"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, UndoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ConfigInputComboProps {
  item: ConfigItem
  removeConfigItem: (itemId: string, setValue?: boolean) => void
  updateConfigItem: (
    target: string,
    itemId: string,
    value: string | boolean,
  ) => void
  editMode: boolean
}

export default function ConfigInputCombo({
  item,
  removeConfigItem,
  updateConfigItem,
  editMode,
}: ConfigInputComboProps) {
  return (
    <div
      key={item.id}
      className="flex items-center gap-4 py-1 text-foreground bg-background"
    >
      <div
        className={cn(
          "flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground bg-background",
          item.deleted ? "opacity-50" : "",
        )}
      >
        <div className="space-y-2">
          <PrefixedInput
            id={`key-${item.id}`}
            value={item.key}
            disabled={item.deleted}
            editMode={editMode && !item.base}
            prefix={"Key"}
            onChange={e => updateConfigItem("key", item.id, e.target.value)}
            placeholder="Configuration key"
          />
        </div>

        <div className="space-y-2">
          <PrefixedInput
            id={`value-${item.id}`}
            value={item.value}
            format={item.format}
            disabled={item.deleted}
            prefix={"Value"}
            editMode={editMode}
            onChange={e => updateConfigItem("value", item.id, e.target.value)}
            onValueChange={e => {
              updateConfigItem("value", item.id, e)
            }}
            placeholder="Configuration value"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center space-x-2",
            item.deleted ? "opacity-50" : "",
          )}
        >
          {editMode ? (
            <Checkbox
              id={`encrypted-${item.id}`}
              disabled={item.base}
              checked={item.encrypted}
              onCheckedChange={checked =>
                updateConfigItem("encrypted", item.id, checked as boolean)
              }
            />
          ) : (
            item.encrypted && <Badge variant="secondary">Encrypted</Badge>
          )}
          {editMode && (
            <Label htmlFor={`encrypted-${item.id}`} className="text-sm">
              Encrypted
            </Label>
          )}
        </div>

        {editMode && (
          <Button
            variant={"destructive"}
            size="sm"
            disabled={item.base}
            onClick={() => {
              return removeConfigItem(item.id, !item.deleted)
            }}
            className="hover:text-red-700 hover:bg-red-50"
            title={item.deleted ? "Undo deletion" : "Delete item"}
          >
            {item.deleted ? (
              <UndoIcon className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
