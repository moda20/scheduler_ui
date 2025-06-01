import axios from "@/lib/httpUtils"
import type { ConfigItem, ConfigType } from "@/models/configs"

const configService = {
  getAllConfigs(): Promise<ConfigType> {
    return axios.get("system/config/getConfig")
  },
  updateConfig(newConfig: Array<ConfigItem>) {
    return axios.post("system/config/updateConfig", newConfig)
  },
}

export default configService
