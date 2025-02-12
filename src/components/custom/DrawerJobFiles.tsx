import { Button } from "@/components/ui/button"
import {
  ArrowDownFromLine,
  CogIcon,
  FileJson2,
  Files,
  FileX2,
  Trash2,
} from "lucide-react"
import SheetActionDialog from "@/components/sheet-action-dialog"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import type { ReactNode } from "react"
import jobsService from "@/services/JobsService"
import { useCallback, useEffect, useState } from "react"
import moment from "moment"
import { humanFileSize } from "@/utils/numberUtils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ButtonGroup } from "@/components/ui/buttonGroup"
import ConfirmationDialogAction from "@/components/confirmationDialogAction"
import { toast } from "@/hooks/use-toast"
import type { CacheFile, jobLog } from "@/models/cacheFiles"

export interface DrawerJobFilesProps {
  JobDetails: jobsTableData
  trigger: ReactNode
}

export default function DrawerJobFiles({
  JobDetails,
  trigger,
}: DrawerJobFilesProps) {
  const [cacheFiles, setCacheFiles] = useState<jobLog[]>([])
  const getCacheFiles = () => {
    jobsService.getJobCacheFiles(JobDetails.id.toString()).then(data => {
      data.logs.forEach((log: jobLog) => {
        log.cacheFiles?.forEach((cacheFile: CacheFile) => {
          cacheFile["parsed_file_size"] = humanFileSize(cacheFile.file_size)
        })
      })
      setCacheFiles(data.logs)
    })
  }

  const downloadFile = useCallback(
    (file: CacheFile, nature: string) => {
      switch (nature) {
        case "cache":
          return jobsService
            .downloadCacheFile(file.id, file.file_name)
            .then(() => {
              toast({
                title: `Cache file ${file.file_name} downloaded`,
                duration: 2000,
              })
              return getCacheFiles()
            })
        default:
          break
      }
    },
    [JobDetails],
  )

  const deleteFile = useCallback(
    (file: CacheFile, nature: string) => {
      switch (nature) {
        case "cache":
          return jobsService
            .deleteCacheFile(file.id, file.file_name)
            .then(() => {
              toast({
                title: `Cache file ${file.file_name} deleted`,
                duration: 2000,
              })
            })
        default:
          break
      }
    },
    [JobDetails],
  )

  useEffect(() => {
    getCacheFiles()
  }, [])

  return (
    <SheetActionDialog
      side={"right"}
      title={`Job Files for ${JobDetails.name}`}
      description={"Manage your exported files"}
      trigger={trigger}
      onOpenChange={v => {
        if (v) {
          getCacheFiles()
        }
      }}
    >
      <div className={"flex flex-col gap-2 py-4"}>
        <div className="text-lg font-bold">Cache Files:</div>
        <ScrollArea className="min-h-96">
          <div className="flex flex-col gap-4">
            {cacheFiles.map((logParent: any, index: number) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex flex-row gap-1.5 items-center">
                  <div className="separator h-[0.1px] bg-foreground opacity-50 w-1/6"></div>
                  <div className="text-xs italic font-bold">
                    {logParent.job_log_id}
                  </div>
                </div>
                {logParent.cacheFiles.map((log: any, index: number) => (
                  <div
                    key={log.created_at}
                    className="flex flex-row gap-3 items-center border border-border rounded-md p-2 bg-sidebar"
                  >
                    <span title={log.file_type}>
                      {log.file_type === "json" ? <FileJson2 /> : <Files />}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-bold">{log.file_name}</div>
                      <div className="text-xs text-[--muted-foreground]">
                        <span className="font-semibold">Created at: </span>
                        <span title={log.created_at}>
                          {moment(log.created_at).format("YYYY-MM-DD HH")}h
                        </span>
                        , <span className="font-semibold">Size</span>:{" "}
                        <span>{log.parsed_file_size}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center ml-auto">
                      <ButtonGroup orientation={"vertical"}>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          className="w-8 h-6 [&_svg]:size-3.5 border-border"
                          onClick={() => downloadFile(log, "cache")}
                        >
                          <ArrowDownFromLine />
                        </Button>
                        <ConfirmationDialogAction
                          title={"Delete cache file"}
                          description={`This will delete the ${log.file_name} cache file permanently`}
                          takeAction={() => deleteFile(log, "cache")}
                          confirmText={"Delete cache file"}
                          confirmVariant={"destructive"}
                        >
                          <Button
                            variant={"destructive"}
                            size={"icon"}
                            className="w-8 h-6 [&_svg]:size-3.5 border-t-0 rounded-t-none"
                            onClick={e => e.preventDefault()}
                          >
                            <Trash2 />
                          </Button>
                        </ConfirmationDialogAction>
                      </ButtonGroup>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {cacheFiles.length === 0 && (
            <div className="flex flex-col gap-2 items-center justify-center p-2 border-border border rounded-md">
              <FileX2 />
              <div className="text-muted-foreground text-sm">
                No cache files found
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </SheetActionDialog>
  )
}
