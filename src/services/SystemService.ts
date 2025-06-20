import axios from "@/lib/httpUtils"
import type { ProxyTableData } from "@/models/proxies"
import type { ProxyConfigUpdateType } from "@/components/custom/system/ProxyConfigDialog"

const systemService = {
  getDatabaseInformation(): Promise<any> {
    return axios.get("/system/getDbConnection")
  },
  downloadSchedulerDBBackupFile(): Promise<any> {
    return axios
      .get("/system/backupAndDownloadSchedulerDB", {
        responseType: "arraybuffer",
        fetchOptions: {
          fullResponse: true,
          onlyJSON: false,
        },
      })
      .then(response => {
        const blob = new Blob([response.data], { type: "application/zip" })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = downloadUrl
        const filename =
          response.headers["content-disposition"].split("filename=")[1]
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)
        return filename
      })
  },
  getBaseDatabaseInformation(): Promise<any> {
    return axios.get("/system/getBaseDbConnection")
  },
  downloadBaseDBBackupFile(): Promise<any> {
    return axios
      .get("/system/backupAndDownloadBaseDB", {
        responseType: "arraybuffer",
        fetchOptions: {
          fullResponse: true,
          onlyJSON: false,
        },
      })
      .then(response => {
        const blob = new Blob([response.data], { type: "application/zip" })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = downloadUrl
        const filename =
          response.headers["content-disposition"].split("filename=")[1]
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)
        return filename
      })
  },
  getAllProxies(): Promise<Array<ProxyTableData>> {
    return axios.get("/proxies/getAllProxies")
  },
  updateProxy(id: number, proxyData: ProxyConfigUpdateType): Promise<any> {
    return axios.put("/proxies/updateProxy", {
      id,
      ...proxyData,
    })
  },
  addProxy(proxyData: ProxyConfigUpdateType): Promise<any> {
    return axios.post("/proxies/addProxy", proxyData)
  },
  addProxyToJob(id: number | string, jobIds: Array<number>): Promise<any> {
    return axios.post("/proxies/addProxyToJob", {
      id,
      job_ids: jobIds,
    })
  },
  deleteProxy(id: number | string): Promise<any> {
    return axios.delete("/proxies/deleteProxy", {
      params: {
        id,
      },
    })
  },
}

export default systemService
