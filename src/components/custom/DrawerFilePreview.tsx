import SheetActionDialog from "@/components/sheet-action-dialog"
import { ReactNode, useCallback, useState } from "react"
import jobsService from "@/services/JobsService"
import MonacoFileViewer from "@/components/custom/MonacoFileViewer"
import { jobFileTypes } from "@/models/cacheFiles"
import { getMimeTypeFromExtension } from "@/utils/generalUtils"

export interface DrawerFilePreviewProps {
  trigger: ReactNode
  id: string
  fileName: string
  fileType: string
  fileNature: string
}

export default function DrawerFilePreview({
  trigger,
  id,
  fileName,
  fileType,
  fileNature,
}: DrawerFilePreviewProps) {
  const [fileContent, setFileContent] = useState<any>("")

  const getCacheFiles = useCallback(() => {
    switch (fileNature) {
      case "cache":
        return jobsService.readCacheFile(id, fileName).then(res => {
          const sentFileType = res.headers["content-type"]

          if (sentFileType?.includes(getMimeTypeFromExtension(fileType))) {
            setFileContent(res.data)
          }
        })
      case "output":
        return jobsService.readOutputFile(id, fileName).then(res => {
          const sentFileType = res.headers["content-type"]
          if (sentFileType?.includes(getMimeTypeFromExtension(fileType))) {
            setFileContent(res.data)
          }
        })
      default:
        break
    }
  }, [fileName, fileType, id])

  return (
    <SheetActionDialog
      side={"right"}
      title={`Previewing ${fileName}`}
      description={"File preview"}
      contentClassName={
        "w-[600px] sm:w-[800px] sm:max-w-[800px] h-full flex flex-col"
      }
      innerContainerClassName={"pb-0"}
      trigger={trigger}
      onOpenChange={v => {
        if (v) {
          getCacheFiles()
        }
      }}
    >
      {fileContent && (
        <MonacoFileViewer
          fileName={fileName}
          fileType={fileType}
          fileContent={fileContent}
        />
      )}
    </SheetActionDialog>
  )
}
