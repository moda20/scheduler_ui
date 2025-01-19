import { Button } from "@/components/ui/button"
import { CogIcon, DeleteIcon, SaveIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlayIcon } from "@radix-ui/react-icons"
import SheetActionDialog from "@/components/sheet-action-dialog"
import { config, setConfigItem } from "@/app/reducers/uiReducer"
import { toast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useEffect, useRef, useState } from "react"

export default function DrawerMenuConfigurator() {
  const [keydownEventSet, setKeydownEventSet] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "l") {
        event.preventDefault()
        if (sideBarTriggerRef?.current) {
          sideBarTriggerRef.current.click()
        }
      }
    }
    if (!keydownEventSet) {
      window.addEventListener("keydown", handleKeyDown)
      setKeydownEventSet(true)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      setKeydownEventSet(false)
    }
  }, [])

  const dispatch = useAppDispatch()
  const savedConfig = useAppSelector(config)
  const initialSideBarRef: any = null
  const sideBarTriggerRef = useRef(initialSideBarRef)
  const [targetServer, setTargetServer] = useState<string | undefined>(
    savedConfig.targetServer,
  )

  const updateSavedTargets = (newTarget?: string) => {
    const updatedTargets = Object.assign([], savedConfig.savedTargets)
    if (newTarget && !updatedTargets.includes(newTarget)) {
      updatedTargets.push(newTarget)
    }
    dispatch(setConfigItem({ name: "savedTargets", value: updatedTargets }))
  }

  const removeSavedTarget = (target: string) => {
    const updatedTargets = Object.assign([], savedConfig.savedTargets)
    updatedTargets.splice(updatedTargets.indexOf(target), 1)
    dispatch(setConfigItem({ name: "savedTargets", value: updatedTargets }))
    toast({
      title: `Target server deleted`,
    })
  }

  const setNewTargetServer = (newTarget?: string) => {
    dispatch(setConfigItem({ name: "targetServer", value: newTarget }))
    toast({
      title: `Target server updated`,
    })
    sideBarTriggerRef.current.click()
  }

  return (
    <SheetActionDialog
      side={"right"}
      title={"Configuration"}
      description={"update server configuration"}
      trigger={
        <Button
          variant={"outline"}
          size={"icon"}
          ref={sideBarTriggerRef}
          className={"border-border"}
        >
          <CogIcon />
        </Button>
      }
    >
      <div>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2 justify-between">
            <Label htmlFor="target" className="text-left">
              Current
            </Label>
            <Input
              name={"target"}
              placeholder="..."
              className="w-6/12"
              value={targetServer}
              onChange={e => setTargetServer(e.target.value)}
            />
            <div className="flex items-center gap-4">
              <Button
                variant={"default"}
                size={"icon"}
                onClick={() => updateSavedTargets(targetServer)}
                className="col-span-1"
              >
                <SaveIcon />
              </Button>
              <Button
                variant={"default"}
                size={"icon"}
                className="col-span-1"
                onClick={() => setNewTargetServer(targetServer)}
              >
                <PlayIcon />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-2 py-2">
          {savedConfig.savedTargets &&
            savedConfig.savedTargets.map((e, i) => (
              <div className="flex items-center gap-4 justify-between" key={i}>
                <div className={"flex items-center gap-4"}>
                  <Label htmlFor="target" className="text-left">
                    Target
                  </Label>
                  <Label htmlFor="target" className="text-left">
                    {e}
                  </Label>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => removeSavedTarget(e)}
                  >
                    <DeleteIcon />
                  </Button>

                  <Button
                    variant={"default"}
                    size={"icon"}
                    onClick={() => setNewTargetServer(e)}
                  >
                    <PlayIcon />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SheetActionDialog>
  )
}
