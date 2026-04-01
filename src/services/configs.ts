import axios from "@/lib/httpUtils"
import type { ConfigItem, ConfigType } from "@/models/configs"

const configService = {
  getAllConfigs(): Promise<{
    configArray: ConfigType
    categoriesMap: any
  }> {
    return axios.get("system/config/getConfig")
  },
  getCategorizedConfigs(): Promise<ConfigType> {
    return axios.get("system/config/getCategorizedConfig")
  },
  updateConfig(newConfig: Array<ConfigItem>) {
    return axios.post("system/config/updateConfig", newConfig)
  },
}

export default configService
