import axios, { AxiosError } from "axios"
import config from "@/configs/appConfig"
import history from "../history/history"
import { disconnect } from "@/app/reducers/authReducer"
import { store } from "@/app/store"
import { toast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/app/hooks"

const service = axios.create({
  baseURL: config.apBaseUrl,
  timeout: 60000,
  responseType: "json",
  fetchOptions: {
    onlyJSON: true,
  },
})
service.defaults.withCredentials = true

// Config
const ENTRY_ROUTE = "/auth/login"
const TOKEN_PAYLOAD_KEY = "authorization"
const services = [service]
// API Request interceptor
services.forEach(s =>
  s.interceptors.request.use(config => {
    const jwtToken = localStorage.getItem("AUTH_TOKEN")
    const targetUrl = store.getState().ui.config.targetServer
    if (jwtToken) {
      config.headers[TOKEN_PAYLOAD_KEY] = jwtToken
    }
    if (targetUrl) {
      config.baseURL = targetUrl
    }

    return config
  }),
)

// API response interceptor
services.forEach(s =>
  s.interceptors.response.use(
    response => {
      if (response.config?.fetchOptions?.onlyJSON) {
        if (response.headers["content-type"] !== "application/json") {
          throw new AxiosError("Invalid response type")
        }
      }

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

      if (error.response?.status === 401) {
        notificationParam.description = "Authentication Fail"
        notificationParam.description = "Please login again"
        const dispatch = useAppDispatch()
        dispatch(disconnect())
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
