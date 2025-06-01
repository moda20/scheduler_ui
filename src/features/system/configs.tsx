import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DatabaseBackup,
  Edit3,
  Eye,
  FolderKanban,
  LucideDatabase,
  LucideDatabaseZap,
  Plus,
  SaveIcon,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import systemService from "@/services/SystemService"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import type { ConfigItem, ConfigType } from "@/models/configs"
import ConfigBlock from "@/components/custom/configs/configBlock"
import configService from "@/services/configs"
import ConfirmationDialogAction from "@/components/confirmationDialogAction"
import { genUID, isEqual } from "@/utils/generalUtils"

export default function ConfigsDashboard() {
  const [editMode, setEditMode] = useState(false)
  const [config, setConfig] = useState<Array<ConfigItem>>([])
  const [shadowConfig, setShadowConfig] = useState<Array<ConfigItem>>([])
  const [configChanged, setConfigStatus] = useState<Boolean>(false)

  const convertConfigStructure = useCallback((config: ConfigType) => {
    const recParse = (parentKey: string, input: ConfigType): any => {
      if (typeof input === "object") {
        if ("db_mirror" in input) {
          return {
            id: genUID(),
            title: input.doc || "",
            key: parentKey,
            value: input.value,
            encrypted: input.is_encrypted,
            base: input.base,
            format: input.format,
          }
        } else {
          return {
            id: genUID(),
            title: input.doc || parentKey || "",
            subGroups: Object.keys(input).map(e => recParse(e, input[e])),
          }
        }
      }
      return input
    }
    const parsedConfig = recParse("", config)
    return parsedConfig.subGroups
  }, [])

  const getFullConfig = useCallback(() => {
    configService.getAllConfigs().then(data => {
      const convertedConfig = convertConfigStructure(data)
      setConfig(convertedConfig)
      setShadowConfig(JSON.parse(JSON.stringify(convertedConfig)))
    })
  }, [convertConfigStructure])

  useEffect(() => {
    getFullConfig()
  }, [getFullConfig])

  useEffect(() => {
    console.log(config, shadowConfig)
    const isEqualConfigs = isEqual(config, shadowConfig)
    setConfigStatus(isEqualConfigs)
  }, [config, shadowConfig])

  const addConfigItem = useCallback(
    (id?: string, type: "block" | "item" = "item") => {
      const newConfig = Object.assign([] as Array<ConfigItem>, config)
      const targetConfig = newConfig.find(e => e.id === id)
      if (targetConfig) {
        targetConfig.subGroups?.push({
          id: genUID(),
          title: "new config",
          key: "",
          value: "",
        })
      } else {
        if (type === "block") {
          newConfig.unshift({
            id: genUID(),
            title: "new config",
            value: "",
            subGroups: [
              {
                id: genUID(),
                key: "",
                value: "",
              },
            ],
          })
        } else {
          newConfig.unshift({
            id: genUID(),
            key: "",
            value: "",
          })
        }
      }
      setConfig([...newConfig])
    },
    [config],
  )

  const removeConfigItem = useCallback(
    (itemId: string, parentId?: string, setValue: boolean = true) => {
      const newConfig = JSON.parse(JSON.stringify(config))
      let targetConfig
      let targetConfigList
      if (!parentId) {
        const parentItem = newConfig.find(e => e.id === itemId)
        const isOriginalItem = shadowConfig.find(e => e.id === itemId)
        if (parentItem) {
          if (isOriginalItem) {
            parentItem.deleted = setValue
          } else {
            targetConfigList = config.filter(e => e.id !== itemId)
          }
        }
      } else {
        targetConfig = newConfig.find(e => e.id === parentId)
        if (targetConfig) {
          const isOriginalItem = shadowConfig
            .find(e => e.id === parentId)
            ?.subGroups?.find(e => e.id === itemId)
          if (isOriginalItem) {
            ;(
              targetConfig.subGroups?.find(e => e.id === itemId) as ConfigItem
            ).deleted = setValue
          } else {
            targetConfigList = config
              .find(e => e.id === parentId)
              ?.subGroups?.filter(e => e.id === itemId)
          }
        }
      }

      setConfig(targetConfigList ? [...targetConfigList] : [...newConfig])
    },
    [config],
  )

  const updateConfigItem = useCallback(
    (
      target: string,
      itemId: string,
      value: string | boolean,
      parentId?: string,
    ) => {
      const targetConfig = parentId
        ? config
            .find(e => e.id === parentId)
            ?.subGroups?.find(e => e.id === itemId)
        : config.find(e => e.id === itemId)
      if (targetConfig) {
        targetConfig[target] = value
      }
      setConfig([...config])
    },
    [config],
  )

  const updateGroupTitle = useCallback(
    (id: string, title: string) => {
      const targetConfig = config.find(e => e.id === id)
      if (targetConfig) {
        targetConfig.title = title
      }
      setConfig([...config])
    },
    [config],
  )

  const saveDiffConfig = useCallback(() => {
    const convertedConfig = convertToConfigStructure(config)
    const shadowConfigConverted = convertToConfigStructure(shadowConfig)
    const mappedShadowConfig = shadowConfigConverted.reduce((p, c) => {
      p[c.key] = c
      return p
    }, {})
    console.log(config)
    console.log(convertedConfig)
    console.log(shadowConfigConverted)
    const newDiffs = convertedConfig.filter(
      e => !shadowConfigConverted.map(e => e.key).includes(e.key),
    )
    const deletedDiffs = convertedConfig
      .filter(e => e.deleted)
      .map(e => {
        return {
          ...e,
          value: null,
        }
      })
    const updatedDiffs = convertedConfig.filter(
      e =>
        e.key in mappedShadowConfig &&
        (mappedShadowConfig[e.key].value !== e.value ||
          mappedShadowConfig[e.key].encrypted !== e.encrypted),
    )
    console.log("new Diffs", newDiffs)
    console.log("deleted Diffs", deletedDiffs)
    console.log("updated Diffs", updatedDiffs)
    const fullDiffs = [...newDiffs, ...deletedDiffs, ...updatedDiffs]
    return configService.updateConfig(fullDiffs).then(response => {
      toast({
        title: `System configuration updated`,
        duration: 2000,
      })
      return getFullConfig()
    })
  }, [config, shadowConfig])

  const convertToConfigStructure = useCallback((config: Array<ConfigItem>) => {
    const recConvert = (parentKey: string, input: any): any => {
      const combinedKey = `${parentKey ? parentKey + "." : ""}${input.key ?? input.title}`
      if (input.subGroups) {
        return input.subGroups.map((sg: any) => recConvert(combinedKey, sg))
      } else {
        return [
          {
            key: combinedKey,
            value: input.value,
            is_encrypted: input.is_encrypted ?? input.encrypted,
            deleted: input.deleted,
          },
        ]
      }
    }
    return config.map(e => recConvert("", e).flat()).flat()
  }, [])
  return (
    <div className="flex flex-col gap-4">
      <div className={"flex items-center justify-between"}>
        <div className={"flex flex-col gap-1 mb-4"}>
          <h2 className="text-2xl font-bold tracking-tight">
            System configuration
          </h2>
          <p className="text-md font-light">
            Manage basic configurations and secrets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!configChanged && (
            <ConfirmationDialogAction
              title={"Save configuration Changes"}
              description={`This will update the server configuration, only new running jobs (instance) will be affected`}
              takeAction={() => saveDiffConfig()}
              confirmText={"Save configuration"}
              confirmVariant={"default"}
            >
              <Button
                size="sm"
                variant="destructive"
                className="border-none focus:ring-0 outline-none"
              >
                <SaveIcon />
                <span className="text-sm">Save</span>
              </Button>
            </ConfirmationDialogAction>
          )}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm">View</span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
            <span className="text-sm">Edit</span>
            <Edit3 className="h-4 w-4" />
          </div>
        </div>
      </div>
      {editMode && (
        <div className="flex gap-4 items-center">
          <Button
            variant="dashed"
            onClick={() => addConfigItem(undefined, "item")}
            className="w-full gap-2 border-dashed border-2 border-border hover:border-solid"
          >
            <Plus className="h-4 w-4" />
            Add single config Item
          </Button>
          <Button
            variant="dashed"
            onClick={() => addConfigItem(undefined, "block")}
            className="w-full gap-2 border-dashed border-2 border-border hover:border-solid"
          >
            <Plus className="h-4 w-4" />
            Add a config block
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {config?.map(snf => {
          return (
            <ConfigBlock
              key={snf.id}
              group={snf}
              editMode={editMode}
              addConfigItem={addConfigItem}
              removeConfigItem={removeConfigItem}
              updateConfigItem={updateConfigItem}
              updateGroupTitle={updateGroupTitle}
              undoGroupRemoval={id => removeConfigItem(id, undefined, false)}
            />
          )
        })}
      </div>
    </div>
  )
}
