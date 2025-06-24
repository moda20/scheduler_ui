import axios from "@/lib/httpUtils"
import type { LoginFormData, RegisterFormData } from "@/models/auth"
export default {
  login(data: LoginFormData): Promise<any> {
    return axios.post("/auth/login", data)
  },
  register(data: RegisterFormData): Promise<any> {
    return axios.post("/auth/register", data, {})
  },
  me(): any {
    return axios.get("/auth/me")
  },
}
