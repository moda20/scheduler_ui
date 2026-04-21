import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/app/hooks"
import { ConnectionStatus, connectionStatus } from "@/app/reducers/authReducer"
import { Clock, GitBranchIcon, Server } from "lucide-react"
import systemService from "@/services/SystemService"
import { ButtonWithTooltip } from "@/components/custom/general/ButtonWithTooltip"
import { toast } from "@/hooks/use-toast"
import { useCallback, useState } from "react"

const REFETCH_INTERVAL_MS = 60000
const STALE_TIME_MS = 59000

export default function ServerStatus() {
  const targetConnectionStatus = useAppSelector(connectionStatus)
  const isConnected = targetConnectionStatus === ConnectionStatus.CONNECTED
  const [copied, setCopied] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["serverStatus", "version"],
    queryFn: systemService.getVersion,
    enabled: isConnected,
    refetchInterval: REFETCH_INTERVAL_MS,
    staleTime: STALE_TIME_MS,
    placeholderData: {},
  })

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(data.version)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy API key",
        variant: "destructive",
        duration: 1000,
      })
    }
  }, [data])

  if (!isConnected) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
        <Server className="h-3 w-3" />
        <span>Connecting...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs">
        <Badge variant="destructive" className="gap-1">
          <Server className="h-3 w-3" />
          Offline
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 px-2 py-1 text-xs text-muted-foreground">
      <div className="flex items-center gap-2 ps-1">
        <Server className="h-3 w-3" />
        {data.name}
      </div>
      <ButtonWithTooltip
        tooltipContent={
          copied ? "Copied to clipboard" : "Click to copy version"
        }
        tooltipContentClassName="text-foreground bg-background"
        variant="ghost"
        className="flex gap-2 p-0 px-1 justify-start text-xs h-5"
        onClick={handleCopy}
      >
        <GitBranchIcon className="!h-3 !w-3" />
        <span className="truncate">{data.version}</span>
      </ButtonWithTooltip>
      <div className="flex items-center gap-1 ps-1">
        <Clock className="h-3 w-3" />
        <span>Uptime: {data.uptime}</span>
      </div>
    </div>
  )
}
