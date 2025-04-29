import axios from "@/lib/httpUtils"
import type { LoginFormData, RegisterFormData } from "@/models/auth"
export default {
  login(data: LoginFormData) {
    return axios.post("/auth/login", data)
  },
  register(data: RegisterFormData) {
    return axios.post("/auth/register", data, {})
  },
  me(): any {
    return axios.get("/auth/me")
  },
}
