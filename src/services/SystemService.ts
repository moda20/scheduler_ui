import axios from "@/lib/httpUtils"

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
}

export default systemService
