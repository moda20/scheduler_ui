import axios from "@/lib/httpUtils"

const systemService = {
  getDatabaseInformation(): Promise<any> {
    return axios.get("/system/getDbConnection")
  },
}

export default systemService
