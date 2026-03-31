import { Edit3, Eye, SaveIcon } from "lucide-react"
import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import type {
  CategorizedConfigs,
  ConfigItem,
  ConfigType,
  ConfigViewType,
} from "@/models/configs"
import configService from "@/services/configs"
import ConfirmationDialogAction from "@/components/confirmationDialogAction"
import { genUID, isEqual } from "@/utils/generalUtils"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import LoadingOverlay from "@/components/custom/LoadingOverlay"

import { ConfigAside } from "@/components/custom/configs/ConfigAside"
import { ConfigCenter } from "@/components/custom/configs/ConfigCenter"

export default function ConfigsDashboard() {
  const queryClient = useQueryClient()
  const [activeView, setActiveView] = useState<ConfigViewType>("system")
  const [editMode, setEditMode] = useState(false)
  const [categorizedConfigs, setCategorizedConfigs] =
    useState<CategorizedConfigs>({} as CategorizedConfigs)
  const [config, setConfig] = useState<Array<ConfigItem>>([])
  const [shadowConfig, setShadowConfig] = useState<Array<ConfigItem>>([])

  const convertConfigStructure = useCallback((config: ConfigType) => {
    const recParse = (parentKey: string, input: ConfigType): any => {
      if (typeof input === "object") {
        if ("db_mirror" in input) {
          return {
            id: genUID(),
            title: input.doc || "",
            key: parentKey,
            value: input.value,
            is_encrypted: input.is_encrypted,
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
    const parsedConfig = Object.keys(config).reduce((p, cfgKey: string) => {
      p[cfgKey] = recParse("", config[cfgKey]).subGroups
      return p
    }, {} as CategorizedConfigs)
    return {
      parsedConfig,
      configList: Object.values(parsedConfig).flat(),
    }
  }, [])

  const { data: rawConfig, isLoading } = useQuery({
    queryKey: ["configs"],
    queryFn: configService.getCategorizedConfigs,
  })

  React.useEffect(() => {
    if (rawConfig) {
      const { configList, parsedConfig } = convertConfigStructure(rawConfig)
      setCategorizedConfigs(parsedConfig)
      setConfig(configList)
      setShadowConfig(JSON.parse(JSON.stringify(configList)))
    }
  }, [rawConfig, convertConfigStructure])

  const configChanged = useMemo(() => {
    return isEqual(config, shadowConfig)
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
      const newConfig: Array<ConfigItem> = JSON.parse(JSON.stringify(config))
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
              ?.subGroups?.filter(e => e.id !== itemId)
          }
        }
      }

      setConfig(targetConfigList ? [...targetConfigList] : [...newConfig])
    },
    [config],
  )

  const updateConfigItem = useCallback(
    (target: string, value: string | boolean, path?: string[]) => {
      const targetConfigUsingPath = config.reduce(
        (p: any, c: any, index: number) => {
          return p.subGroups?.find((e: any) => e.id === path?.[index]) ?? p
        },
        {
          subGroups: config,
        },
      )
      if (targetConfigUsingPath) {
        targetConfigUsingPath[target] = value
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

  const updateConfigMutation = useMutation({
    mutationFn: (fullDiffs: Array<ConfigItem>) => {
      return configService.updateConfig(fullDiffs)
    },
    onSuccess: () => {
      toast({
        title: `System configuration updated`,
        duration: 2000,
      })
      queryClient.invalidateQueries({ queryKey: ["configs"] })
    },
    onError: (error: any) => {
      toast({
        title: `Error updating configuration: ${error.message}`,
        duration: 3000,
        variant: "destructive",
      })
    },
  })

  const saveDiffConfig = useCallback(() => {
    const convertedConfig = convertToConfigStructure(config)
    const shadowConfigConverted = convertToConfigStructure(shadowConfig)
    const mappedShadowConfig = shadowConfigConverted.reduce((p, c) => {
      p[c.key] = c
      return p
    }, {})
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
          mappedShadowConfig[e.key].is_encrypted !== e.is_encrypted),
    )
    const fullDiffs = [...newDiffs, ...deletedDiffs, ...updatedDiffs]
    updateConfigMutation.mutate(fullDiffs)
  }, [config, shadowConfig, updateConfigMutation])

  const convertToConfigStructure = useCallback((config: Array<ConfigItem>) => {
    const recConvert = (parentKey: string, input: any): any => {
      const combinedKey = `${parentKey ? parentKey + "." : ""}${input.key ?? input.title}`
      if (input.subGroups) {
        return input.subGroups
          .map((sg: any) => recConvert(combinedKey, sg))
          .flat()
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
    <div className="w-full h-full relative">
      <div
        className={
          "flex items-center justify-between absolute top-4 right-4 z-50"
        }
      >
        <div className="flex items-center gap-2 ml-auto h-6">
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
            <Switch
              aria-label="Toggle edit mode"
              checked={editMode}
              onCheckedChange={setEditMode}
            />
            <span className="text-sm">Edit</span>
            <Edit3 className="h-4 w-4" />
          </div>
        </div>
      </div>

      <LoadingOverlay isLoading={isLoading || updateConfigMutation.isPending}>
        <div className="flex flex-1 overflow-hidden gap-2">
          <div className={cn("h-full flex-shrink-0 sticky")}>
            <ConfigAside activeView={activeView} onViewChange={setActiveView} />
          </div>

          <div className="flex-1 h-[calc(100vh-6rem)]">
            <ConfigCenter
              activeView={activeView}
              categorizedConfigs={categorizedConfigs}
              editMode={editMode}
              addConfigItem={addConfigItem}
              removeConfigItem={removeConfigItem}
              updateConfigItem={updateConfigItem}
              updateGroupTitle={updateGroupTitle}
              undoGroupRemoval={id => removeConfigItem(id, undefined, false)}
            />
          </div>
        </div>
      </LoadingOverlay>
    </div>
  )
}
