import type { ConfigItem } from "@/models/configs"

export interface CategorizedConfigs {
  system: ConfigItem[]
  logging: ConfigItem[]
  notifications: ConfigItem[]
  custom: ConfigItem[]
}

export type ConfigCategory = keyof CategorizedConfigs

export function categorizeConfig(configs: ConfigItem[]): CategorizedConfigs {
  const categorized: CategorizedConfigs = {
    system: [],
    logging: [],
    notifications: [],
    custom: [],
  }

  configs.forEach(config => {
    const category = getConfigCategory(config)
    categorized[category].push(config)
  })

  return categorized
}

function getConfigCategory(config: ConfigItem): ConfigCategory {
  // key or title base categorization
  const key = config.key || config.title
  if (!key) return "custom"
  if (
    key === "env" ||
    key === "appName" ||
    key === "swaggerServer" ||
    key.startsWith("server") ||
    key.startsWith("jobs") ||
    key.startsWith("DB") ||
    key.startsWith("baseDB")
  ) {
    return "system"
  }
  if (
    key.startsWith("server.logToConsole") ||
    key.startsWith("server.logSystemEvents") ||
    key.startsWith("files")
  ) {
    return "logging"
  }

  if (key.startsWith("notifications") || key.startsWith("grafana")) {
    return "notifications"
  }

  // Custom configs: everything else or user-added configs (no base flag)
  if (!config.base) {
    return "custom"
  }

  return "custom"
}
