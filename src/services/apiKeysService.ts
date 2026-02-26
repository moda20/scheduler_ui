import axios from "@/lib/httpUtils"

const apiKeysService = {
  getAllApiKeys(): Promise<Array<any>> {
    return axios.post("/auth/keys/keys")
  },
  createApiKey(name: string): Promise<any> {
    return axios.post("/auth/keys/createKey", { name })
  },
  deleteApikey(keyId: string): Promise<any> {
    return axios.delete("/auth/keys/deleteKey", { data: { keyId } })
  },
}

export default apiKeysService
