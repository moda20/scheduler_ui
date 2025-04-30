import authService from "@/services/authService"
import { store } from "@/app/store"
import {
  ConnectionStatus,
  setConnectionStatus,
  setUser,
} from "@/app/reducers/authReducer"
import type { LoginFormData } from "@/models/auth"
import SocketManager from "@/lib/socketUtils"

export const verifyUserConnection = () => {
  authService
    .me()
    .then((data: any) => {
      store.dispatch(setUser(data as LoginFormData))
      store.dispatch(setConnectionStatus(ConnectionStatus.CONNECTED))
      const socketManager = new SocketManager()
      socketManager.createSocket()
    })
    .catch((err: any) => {
      console.error(err)
      store.dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED))
    })
}
