import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export interface ConfigAddBlockProps {
  addConfigItem: (id?: string, type?: "block" | "item") => void
  editMode: boolean
}
export function ConfigAddBlock({
  addConfigItem,
  editMode,
}: ConfigAddBlockProps) {
  return (
    editMode && (
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          onClick={() => addConfigItem(undefined, "item")}
          className="w-full gap-2 border-dashed border-2 border-border hover:border-solid hover:bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add single config Item
        </Button>
        <Button
          variant="ghost"
          onClick={() => addConfigItem(undefined, "block")}
          className="w-full gap-2 border-dashed border-2 border-border hover:border-solid hover:bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add a config block
        </Button>
      </div>
    )
  )
}
