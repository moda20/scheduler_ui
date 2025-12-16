import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import useDialogueManager from "@/hooks/useDialogManager"
import { useHotkeys } from "react-hotkeys-hook"
import type { ReactNode } from "react"
import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import jobsService from "@/services/JobsService"
import { ItemSkeleton } from "@/components/custom/general/Skeletons"
import { debounce } from "@/utils/generalUtils"
import ActionDropdown from "@/components/custom/jobsTable/actionDropdown"
import type { jobsTableData } from "@/features/jobsTable/interfaces"
import { defaultLogPeriod, jobActions } from "@/features/jobsTable/interfaces"
import { getConsumersCBox, takeAction } from "@/features/jobsTable/jobsUtils"
import { Clock, FileArchive, LoaderIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface SearchBarProps {
  trigger?: ReactNode
}

export default function SearchBar({ trigger }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isDialogOpen, setDialogState } = useDialogueManager()

  useHotkeys(["ctrl+k", "meta+k"], () => {
    if (isDialogOpen) {
      inputRef.current?.focus()
    } else {
      setDialogState(true)
    }
  })

  const [searchKey, setSearchKey] = useState("")
  const [jobsList, setJobsList] = useState<Array<jobsTableData>>([])
  const [listLoading, setListLoadingStatus] = useState(false)

  const searchForJobs = useCallback(
    async (searchKey: string) => {
      debounce(() => {
        setSearchKey(searchKey)
        jobsService.searchJobs(searchKey, 10, 0).then(jobs => {
          setJobsList(jobs)
          setListLoadingStatus(false)
        })
      }, 300)()
    },
    [searchKey],
  )

  const resetState = useCallback(() => {
    setSearchKey("")
    setJobsList([])
  }, [])

  const extendedTakeAction = useCallback(
    async (
      row: jobsTableData | null,
      action: jobActions,
      data?: any,
      batchProcessIds?: number[],
    ) => {
      await takeAction(row, action, data, batchProcessIds)
      switch (action) {
        case jobActions.UPDATE:
        case jobActions.UNSCHEDULE:
        case jobActions.SCHEDULE:
          await searchForJobs(searchKey)
          break
        default:
          break
      }
    },
    [searchForJobs, searchKey],
  )

  return (
    <>
      <div onClick={() => setDialogState(true)}>
        {trigger ?? (
          <Button variant="outline" className="border-border">
            <p className="text-sm text-muted-foreground">
              Search ...{" "}
              <kbd className=" border-none pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </p>
          </Button>
        )}
      </div>
      <CommandDialog
        open={isDialogOpen}
        onOpenChange={v => {
          setDialogState(v, finalState => {
            if (!finalState) {
              resetState()
            }
          })
        }}
        commandProps={{
          shouldFilter: false,
          onFocus: e => {
            e.preventDefault()
            e.stopPropagation()
          },
        }}
      >
        <CommandInput
          ref={inputRef}
          className="text-foreground"
          placeholder="Type a command or search..."
          onValueChange={e => searchForJobs(e)}
        />
        <CommandList className="py-2">
          <CommandGroup heading="Jobs">
            <CommandEmpty className="text-foreground">
              No results found.
            </CommandEmpty>
            {listLoading && <ItemSkeleton />}
            {jobsList?.map((job: any, index: number) => (
              <ActionDropdown
                key={index}
                columnsProps={{
                  takeAction: extendedTakeAction,
                  getAvailableConsumers: getConsumersCBox,
                }}
                row={job}
                defaultLogPeriod={defaultLogPeriod}
                inputGroup="commandActions"
                modal={true}
              >
                <CommandItem
                  asChild
                  className="rounded"
                  onSelect={e => {
                    console.log("select", e)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span>{job.name}</span>
                      <div className="flex gap-2 text-[12px] items-center font-light">
                        <FileArchive size="10" className="!h-4 !w-4" />
                        {job.consumer}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <Badge
                        title={job.status === "STARTED" ? "Started" : "Stopped"}
                        variant={
                          job.status === "STARTED" ? null : "destructive"
                        }
                      >
                        <Clock className="!w-4 !h-4" />
                      </Badge>
                      <Badge
                        title={
                          job.isCurrentlyRunning ? "Running" : "Not running"
                        }
                        className="w-max"
                        variant={job.isCurrentlyRunning ? null : "destructive"}
                      >
                        <LoaderIcon />
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              </ActionDropdown>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
