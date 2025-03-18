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
import type { CacheFile, jobLog, OutputFile } from "@/models/cacheFiles"
import { Badge } from "@/components/ui/badge"
import DrawerFilePreview from "@/components/custom/DrawerFilePreview"

export interface DrawerJobFilesProps {
  JobDetails: jobsTableData
  trigger: ReactNode
}

export default function DrawerJobFiles({
  JobDetails,
  trigger,
}: DrawerJobFilesProps) {
  const [cacheFiles, setCacheFiles] = useState<jobLog[]>([])
  const [outputFiles, setOutputFiles] = useState<jobLog[]>([])
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

  const getOutputFiles = () => {
    jobsService.getJobOutputFiles(JobDetails.id.toString()).then(data => {
      data.logs.forEach((log: jobLog) => {
        log.outputFiles?.forEach((outputFile: OutputFile) => {
          outputFile["parsed_file_size"] = humanFileSize(outputFile.file_size)
        })
      })
      setOutputFiles(data.logs)
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
        case "output":
          return jobsService
            .downloadOutputFile(file.id, file.file_name)
            .then(() => {
              toast({
                title: `Output file ${file.file_name} downloaded`,
                duration: 2000,
              })
              return getOutputFiles()
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
              return getCacheFiles()
            })
        case "output":
          return jobsService
            .deleteOutputFile(file.id, file.file_name)
            .then(() => {
              toast({
                title: `Output file ${file.file_name} deleted`,
                duration: 2000,
              })
              return getOutputFiles()
            })
        default:
          break
      }
    },
    [JobDetails],
  )

  useEffect(() => {
    getCacheFiles()
    getOutputFiles()
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
      modal={true}
    >
      <div className={"flex flex-col gap-2 py-4"}>
        <div className="text-lg font-bold">Cache Files:</div>
        <ScrollArea className="max-h-96">
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
                    <span
                      title={log.file_type}
                      className="flex flex-col gap-1 justify-center items-center"
                    >
                      {log.file_type === "json" ? <FileJson2 /> : <Files />}
                      <DrawerFilePreview
                        trigger={
                          <Button
                            className="italic text-[11px] p-0.5 px-1 h-[unset]"
                            size="sm"
                            variant={"outline"}
                          >
                            Preview
                          </Button>
                        }
                        id={log.id}
                        fileName={log.file_name}
                        fileType={log.file_type}
                        fileNature={"cache"}
                      />
                    </span>
                    <div className="flex flex-col gap-1">
                      <div
                        title={log.file_name}
                        className="text-sm font-bold text-ellipsis overflow-hidden max-w-[200px]"
                      >
                        {log.file_name}
                      </div>
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
        <div className="text-lg font-bold">Output Files:</div>
        <ScrollArea className="max-h-96">
          <div className="flex flex-col gap-4">
            {outputFiles.map((logParent: any, index: number) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex flex-row gap-1.5 items-center">
                  <div className="separator h-[0.1px] bg-foreground opacity-50 w-1/6"></div>
                  <div className="text-xs italic font-bold">
                    {logParent.job_log_id}
                  </div>
                </div>
                {logParent.outputFiles.map((log: any, index: number) => (
                  <div
                    key={log.created_at}
                    className="flex flex-row gap-3 items-center border border-border rounded-md p-2 bg-sidebar"
                  >
                    <span
                      title={log.file_type}
                      className="flex flex-col gap-1 justify-center items-center"
                    >
                      {log.file_type === "json" ? <FileJson2 /> : <Files />}
                      <DrawerFilePreview
                        trigger={
                          <Button
                            className="italic text-[11px] p-0.5 px-1 h-[unset]"
                            size="sm"
                            variant={"outline"}
                          >
                            Preview
                          </Button>
                        }
                        id={log.id}
                        fileName={log.file_name}
                        fileType={log.file_type}
                        fileNature={"output"}
                      />
                    </span>
                    <div className="flex flex-col gap-1">
                      <div
                        title={log.file_name}
                        className="text-sm font-bold text-ellipsis overflow-hidden max-w-[200px]"
                      >
                        {log.file_name}
                      </div>
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
                          onClick={() => downloadFile(log, "output")}
                        >
                          <ArrowDownFromLine />
                        </Button>
                        <ConfirmationDialogAction
                          title={"Delete output file"}
                          description={`This will delete the ${log.file_name} output file permanently`}
                          takeAction={() => deleteFile(log, "output")}
                          confirmText={"Delete output file"}
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
          {outputFiles.length === 0 && (
            <div className="flex flex-col gap-2 items-center justify-center p-2 border-border border rounded-md">
              <FileX2 />
              <div className="text-muted-foreground text-sm">
                No output files found
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </SheetActionDialog>
  )
}
