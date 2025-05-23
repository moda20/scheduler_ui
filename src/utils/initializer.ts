import { store } from "@/app/store"
import { setConfigItem } from "@/app/reducers/uiReducer"
import appConfig from "@/configs/appConfig"
import SocketManager from "@/lib/socketUtils"

export interface SavedConfigInterface {
  targetServer?: string
  savedTargets?: Array<string>
}
export const initializeStore = () => {
  const currentTargetServer =
    localStorage.getItem("targetServer") || appConfig.apBaseUrl
  const savedTargets = localStorage.getItem("savedTargets") || "[]"
  store.dispatch(
    setConfigItem([
      { name: "savedTargets", value: JSON.parse(savedTargets) },
      { name: "targetServer", value: currentTargetServer },
    ]),
  )
}

export const saveConfig = (newConfig: SavedConfigInterface) => {
  localStorage.setItem("targetServer", newConfig.targetServer ?? "")
  localStorage.setItem(
    "savedTargets",
    JSON.stringify(newConfig.savedTargets || []),
  )
}
