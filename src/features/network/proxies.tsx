import BasicPage from "@/components/custom/BasicPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GenericTable } from "@/components/custom/GenericTable"
import proxyTableInterfaces from "@/features/network/interfaces"
import { useEffect, useState } from "react"
import type { ProxyTableData } from "@/models/proxies"
import { ProxyActions, ProxyStatus } from "@/models/proxies"
import systemService from "@/services/SystemService"
import { Row, SortingState } from "@tanstack/react-table"
import {
  ProxyConfigDialog,
  ProxyConfigUpdateType,
} from "@/components/custom/system/ProxyConfigDialog"
import { toast } from "@/hooks/use-toast"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComboBoxItem } from "@/components/ui/combo-box"
import jobsService from "@/services/JobsService"
import { ProxyLinkUpdateType } from "@/components/custom/system/ProxyLinkDialog"

export interface ProxiesPageProps {}

export const proxyDefaultSortingState = [{ id: "id", desc: true }]

export default function Proxies(props: ProxiesPageProps) {
  const [tableData, setTableData] = useState<ProxyTableData[]>([])
  const [sorting, setSorting] = useState<SortingState>(proxyDefaultSortingState)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllProxies()
  }, [])

  const getAllProxies = async () => {
    const data = await systemService.getAllProxies()
    setTableData(data)
  }

  const onPageChange = ({ sorting }: { sorting: SortingState }) => {
    setSorting(sorting)
  }

  async function getAllJobs(): Promise<ComboBoxItem[]> {
    return jobsService.getAllJobs(null, null).then((data: any) => {
      return data.map((item: any) => {
        return {
          value: item.id?.toString(),
          label: item.name,
        }
      })
    })
  }

  const proxyAction = async (
    action: ProxyActions,
    row?: Row<ProxyTableData>,
    proxyData?: ProxyConfigUpdateType,
  ) => {
    setLoading(true)

    switch (action) {
      case ProxyActions.UPDATE:
        if (proxyData?.status !== undefined)
          await systemService
            .updateProxy(Number(row?.original?.id), proxyData!)
            .then(data => {
              toast({
                title: `Proxy ${row?.original?.proxy_ip}:${row?.original?.proxy_port} updated`,
                duration: 2000,
              })
            })
            .finally(() => {
              setLoading(false)
            })
        break
      case ProxyActions.CREATE: {
        await systemService
          .addProxy(proxyData!)
          .then(data => {
            toast({
              title: `Proxy ${proxyData?.proxy_ip}:${proxyData?.proxy_port} created`,
              duration: 2000,
            })
          })
          .finally(() => {
            setLoading(false)
          })
        break
      }
      case ProxyActions.DELETE:
        await systemService.deleteProxy(row!.original?.id).then(data => {
          setLoading(false)
          toast({
            title: `Proxy ${row?.original?.proxy_ip}:${row?.original?.proxy_port} deleted`,
            duration: 3000,
          })
        })
        break
      case ProxyActions.LINK:
        await systemService
          .addProxyToJob(
            proxyData!.id!,
            proxyData!.jobs!.map(e => Number(e)),
          )
          .then(data => {
            toast({
              title: `Proxy ${proxyData?.proxy_ip}:${proxyData?.proxy_port} link updated`,
              duration: 2000,
            })
          })
        break
      default:
        break
    }
    await getAllProxies()
  }

  const columns = proxyTableInterfaces({
    proxyAction,
    getAllJobs,
  })
  return (
    <BasicPage title={"Proxies"} description={"Manage your proxies"}>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 text-foreground bg-background border-border rounded-t-xl">
          <CardTitle className="text-md font-medium">All Proxies</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pb-4">
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-row gap-2"}>
              <ProxyConfigDialog
                onChange={proxyData =>
                  proxyAction(ProxyActions.CREATE, undefined, proxyData)
                }
                isCreateDialog={true}
              >
                <Button variant="outline" className={"border-border"}>
                  <PlusIcon /> New Proxy
                </Button>
              </ProxyConfigDialog>
            </div>
            <GenericTable<ProxyTableData>
              columns={columns}
              data={tableData}
              filters={{ sorting }}
              events={{
                onPageChange: onPageChange,
                actionConfirmed: () => {},
              }}
            />
          </div>
        </CardContent>
      </Card>
    </BasicPage>
  )
}
