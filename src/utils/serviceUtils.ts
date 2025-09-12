import type { AxiosResponse } from "axios"

export const downloadFile = (
  blobResponse: AxiosResponse<any>,
  fileType: string = "application/json",
  inputFileName?: string,
) => {
  const blob = new Blob([blobResponse.data], { type: fileType })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = downloadUrl
  const filename =
    inputFileName ??
    blobResponse.headers["content-disposition"]
      .split("filename=")[1]
      ?.split('"')[1]
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
  return filename
}
