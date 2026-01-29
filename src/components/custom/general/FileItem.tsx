import { ArrowDownFromLine, FileJson2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import moment from "moment"
import type { FileItemModel, LogsStructure } from "@/models/logs"
import { cn } from "@/lib/utils"
import DrawerLogFilePreview from "@/components/custom/DrawerLogFilePreview"
import { useMemo } from "react"

export interface FileItemProps {
  item: FileItemModel
  deleteFile?: (item: any, nature: string, index: number) => void
  downloadFile?: (fileName: string) => void
  readLogFile?: (fileName: string) => Promise<LogsStructure>
  canDelete?: boolean
  canPreview?: boolean
  className?: string
  index?: number
  style?: React.CSSProperties
}

export default function FileItem({
  item,
  index,
  deleteFile,
  downloadFile,
  readLogFile,
  canDelete,
  canPreview,
  className,
  style,
}: FileItemProps) {
  const titleName = item.fileName.split("/").pop()
  const parsedCreatedAt = useMemo(() => {
    return `${moment(item.createAt).format("YYYY-MM-DD HH")}h`
  }, [item])
  return (
    <div
      key={index}
      className={cn("flex flex-col gap-2 w-full", className)}
      style={style}
    >
      {item.blockId && item.index === 0 && (
        <div className="flex flex-row gap-1.5 items-center">
          <div className="separator h-[0.1px] bg-foreground opacity-50 w-1/6"></div>
          <div className="text-xs italic font-bold">{item.blockId}</div>
        </div>
      )}
      <div
        key={item.createAt}
        className="flex flex-row gap-3 items-center border border-border rounded-md p-2 bg-sidebar"
      >
        {canPreview && (
          <span
            title={item.fileType}
            className="flex flex-col gap-1 justify-center items-center"
          >
            {item.fileType === "json" ? <FileJson2 /> : <FileText />}
            <DrawerLogFilePreview
              trigger={
                <Button
                  className="italic text-[11px] p-0.5 px-1 h-[unset]"
                  size="sm"
                  variant={"outline"}
                >
                  Preview
                </Button>
              }
              id={item.fileId}
              fileName={item.fileName}
              titleName={titleName}
              readLogs={readLogFile}
              createdAt={parsedCreatedAt}
              originName={item.originName}
            />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <div
            title={titleName}
            className="text-sm font-bold text-ellipsis overflow-hidden"
          >
            {titleName}
          </div>
          <div className="text-xs text-[--muted-foreground]">
            <span className="font-semibold">Created at: </span>
            <span title={item.createAt}>{parsedCreatedAt}</span>{" "}
            {item.deletionDate && (
              <>
                <span className="font-semibold">Deletion : </span>
                <i title={item.deletionDate}>
                  {moment(item.deletionDate).fromNow()}
                </i>
              </>
            )}
            , <span className="font-semibold">Size</span>:{" "}
            <span>{item.fileSize}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center ml-auto">
          <Button
            variant={"outline"}
            size={"icon"}
            className="w-8 h-6 [&_svg]:size-3.5 border-border"
            onClick={() => downloadFile?.(item.fileName)}
          >
            <ArrowDownFromLine />
          </Button>
        </div>
      </div>
    </div>
  )
}
