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
import LoadingOverlay from "@/components/custom/LoadingOverlay"
import { useProxies } from "@/hooks/useProxies"

export interface ProxiesPageProps {}

export const proxyDefaultSortingState = [{ id: "id", desc: true }]

export default function Proxies(props: ProxiesPageProps) {
  const [sorting, setSorting] = useState<SortingState>(proxyDefaultSortingState)

  const { proxies, isLoading, proxyActions } = useProxies()
  const onPageChange = ({ sorting }: { sorting: SortingState }) => {
    setSorting(sorting)
  }

  async function getAllJobs(): Promise<ComboBoxItem[]> {
    return jobsService
      .getAllJobs(null, undefined, 999999, 0)
      .then((data: any) => {
        return data.map((item: any) => {
          return {
            value: item.id?.toString(),
            label: item.name,
          }
        })
      })
  }

  const columns = proxyTableInterfaces({
    proxyAction: proxyActions,
    getAllJobs,
  })
  return (
    <BasicPage title={"Proxies"} description={"Manage your proxies"}>
      <Card className="border-border border-none">
        <CardContent className="p-0">
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-row gap-2"}>
              <ProxyConfigDialog
                onChange={proxyData =>
                  proxyActions(ProxyActions.CREATE, undefined, proxyData)
                }
                isCreateDialog={true}
              >
                <Button variant="outline" className={"border-border"}>
                  <PlusIcon /> New Proxy
                </Button>
              </ProxyConfigDialog>
            </div>
            <LoadingOverlay isLoading={isLoading}>
              <GenericTable<ProxyTableData>
                columns={columns}
                data={proxies}
                filters={{ sorting }}
                events={{
                  onPageChange: onPageChange,
                  actionConfirmed: () => {},
                }}
              />
            </LoadingOverlay>
          </div>
        </CardContent>
      </Card>
    </BasicPage>
  )
}
