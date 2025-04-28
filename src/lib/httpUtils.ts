import axios from "axios"
import config from "@/configs/appConfig"
import history from "../history/history"
import { auth_token as AUTH_TOKEN } from "@/app/reducers/authReducer"
import { store } from "@/app/store"
import { toast } from "@/hooks/use-toast"

const service = axios.create({
  baseURL: config.apBaseUrl,
  timeout: 60000,
})
const mongoService = axios.create({
  baseURL: config.apBaseUrl + "/mongo",
  timeout: 60000,
})

// Config
const ENTRY_ROUTE = "/auth/login"
const TOKEN_PAYLOAD_KEY = "authorization"
const services = [service, mongoService]
// API Request interceptor
services.forEach(s =>
  s.interceptors.request.use(config => {
    const jwtToken = localStorage.getItem("AUTH_TOKEN")
    const targetUrl = store.getState().ui.config.targetServer
    if (jwtToken) {
      config.headers[TOKEN_PAYLOAD_KEY] = jwtToken
    }
    if (targetUrl) {
      config.baseURL = `${targetUrl}${config?.baseURL?.includes("mongo") ? "/mongo" : ""}`
    }

    return config
  }),
)

// API respone interceptor
services.forEach(s =>
  s.interceptors.response.use(
    response => {
      if (response.config?.fetchOptions?.fullResponse) {
        return response
      }
      return response.data
    },
    error => {
      console.log(error)
      let notificationParam = {
        description: "",
      }

      // Remove token and redirect
      if (error.response?.status === 403) {
        notificationParam.description = "Authentication Fail"
        notificationParam.description = "Please login again"
        localStorage.removeItem("AUTH_TOKEN")
        history.push(ENTRY_ROUTE)
        window.location.reload()
      }

      if (error.response?.status === 404) {
        notificationParam.description = "Not Found"
      }

      if (error.response?.status === 500) {
        notificationParam.description = "Internal Server Error"
      }

      if (error.response?.status === 508) {
        notificationParam.description = "Time Out"
      }

      notificationParam.description =
        error.response?.data?.error ??
        error.response?.data ??
        notificationParam.description
      toast({
        ...notificationParam,
        variant: "destructive",
      })

      return Promise.reject(error)
    },
  ),
)

export default service
export const mongoAxiosService = mongoService
