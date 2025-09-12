import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { ImportIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import useDialogueManager from "@/hooks/useDialogManager"
import { useCallback, useMemo, useState } from "react"
import MonacoFileViewer from "@/components/custom/MonacoFileViewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploadBox } from "@/components/custom/general/FileUploadBox"
import { validateJsonContent } from "@/utils/fileUtils"
import { toast } from "@/hooks/use-toast"
import ErrorBlockComponent from "@/components/custom/general/ErrorBlockComponent"

export interface BatchImportDialogProps {
  children: React.ReactNode
  onChange: (jobsList: any[]) => void
  triggerClassName?: string
}
const batchJobImportSchema = z.array(
  z.object({
    job_name: z.string(),
    job_param: z.string(),
    consumer: z.string(),
    job_cron_setting: z.string(),
    status: z
      .union([
        z.enum(["STOPPED", "STARTED"]),
        z.array(z.enum(["STOPPED", "STARTED"])),
      ])
      .optional(),
  }),
)

export function BatchImportDialog({
  children,
  onChange,
  triggerClassName,
}: BatchImportDialogProps) {
  const [currentTab, setCurrentTab] = useState("file")
  const [fileContent, setFileContent] = useState<any | undefined>("")
  const [clipboardContent, setClipboardContent] = useState<string | undefined>()
  const [clipboardContentError, setClipboardError] = useState<
    string | undefined
  >()
  const { isDialogOpen, setDialogState } = useDialogueManager()

  const resetClipBoardError = useCallback(() => {
    setClipboardError(undefined)
  }, [])
  const resetState = useCallback(() => {
    setCurrentTab("file")
    setFileContent(undefined)
    setClipboardContent(undefined)
    setClipboardError(undefined)
  }, [setCurrentTab, setFileContent, setClipboardContent, setClipboardError])

  const onFileProcessed = useCallback((data: any, fileName: string) => {
    setFileContent(data)
  }, [])

  const onClipboardProcessing = useCallback(() => {
    const { errors, outputContent } = validateJsonContent(clipboardContent)
    if (errors.length) {
      toast({
        title: "Invalid JSON",
        description: "Please check the JSON file and try again",
        duration: 2000,
        variant: "destructive",
      })
    }
    try {
      return batchJobImportSchema.parse(outputContent)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const prettyErrors = z.prettifyError(error)
        setClipboardError(prettyErrors)
      }
    }
  }, [clipboardContent])

  const processImportingJobs = useCallback(() => {
    let finalList: any[] | undefined
    setClipboardError(undefined)
    if (currentTab === "json") {
      const clipboardProcessed = onClipboardProcessing()
      if (clipboardProcessed) {
        finalList = clipboardProcessed
      }
    } else {
      finalList = fileContent
    }
    if (finalList) {
      onChange(finalList)
      setDialogState(false)
    }
  }, [currentTab, fileContent, onChange, onClipboardProcessing, setDialogState])

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={v => {
        setDialogState(v)
        if (!v) {
          resetState()
        }
      }}
    >
      <DialogTrigger
        className={cn(triggerClassName)}
        onClick={v => {
          v.preventDefault()
          setDialogState(true)
        }}
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-[465px] text-foreground bg-background")}
        onEscapeKeyDown={e => {
          e.preventDefault()
          setDialogState(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Import Job from JSON</DialogTitle>
          <DialogDescription>
            import jobs from a JSON file or clipboard
          </DialogDescription>
        </DialogHeader>
        <div className={cn("flex transition-all duration-200")}>
          <Tabs
            defaultValue={currentTab}
            className="w-full"
            onValueChange={setCurrentTab}
          >
            <TabsList className="w-full gap-2">
              <TabsTrigger
                className="border border-border w-full data-[state=active]:bg-sidebar"
                value="file"
              >
                From File
              </TabsTrigger>
              <TabsTrigger
                className="border border-border w-full data-[state=active]:bg-sidebar"
                value="json"
              >
                From Clipboard
              </TabsTrigger>
            </TabsList>
            <TabsContent value="file">
              <FileUploadBox
                title={"Import jobs from JSON"}
                description={""}
                onFileProcessed={onFileProcessed}
                className={"border-none py-2"}
              />
            </TabsContent>
            <TabsContent className="flex flex-col gap-2" value="json">
              <div className="h-[300px]">
                <MonacoFileViewer
                  fileName={`New Jobs`}
                  fileType="json"
                  fileContent={""}
                  onChange={setClipboardContent}
                />
              </div>
              {clipboardContentError && (
                <ErrorBlockComponent onClear={resetClipBoardError}>
                  {clipboardContentError}
                </ErrorBlockComponent>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            type="button"
            onClick={processImportingJobs}
          >
            <ImportIcon /> Import Jobs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
